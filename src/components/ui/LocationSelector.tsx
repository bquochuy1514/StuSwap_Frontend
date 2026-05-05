'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiHome, FiCheck } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import Dropdown from './DropDown';
import { AddressData } from '@/types/auth';

interface LocationSelectorProps {
	addressData?: AddressData;
	onChange?: (data: AddressData) => void;
	isEditing?: boolean;
	showLabel?: boolean;
}

interface Province {
	code: number;
	name: string;
}

interface District {
	code: number;
	name: string;
}

interface Ward {
	code: number;
	name: string;
}

interface ProvinceWithDistricts extends Province {
	districts: (District & { wards?: Ward[] })[];
}

interface DistrictWithWards extends District {
	wards: Ward[];
}

export default function LocationSelector({
	addressData,
	onChange,
	isEditing = true,
	showLabel = true,
}: LocationSelectorProps) {
	const [provinces, setProvinces] = useState<Province[]>([]);
	const [districts, setDistricts] = useState<District[]>([]);
	const [wards, setWards] = useState<Ward[]>([]);

	const [selectedProvince, setSelectedProvince] = useState('');
	const [selectedProvinceCode, setSelectedProvinceCode] = useState<
		number | null
	>(null);
	const [selectedDistrict, setSelectedDistrict] = useState('');
	const [selectedDistrictCode, setSelectedDistrictCode] = useState<
		number | null
	>(null);
	const [selectedWard, setSelectedWard] = useState('');
	const [specificAddress, setSpecificAddress] = useState('');

	const [loading, setLoading] = useState(false);
	const [isInitializing, setIsInitializing] = useState(false);

	const lastEmittedDataRef = useRef<string | null>(null);
	const initializationCompleteRef = useRef(false);

	const provincesCache = useRef<Province[] | null>(null);
	const districtsCache = useRef<Record<number, District[]>>({});
	const wardsCache = useRef<Record<number, Ward[]>>({});

	const BASE_URL = 'https://provinces.open-api.vn/api';

	const fetchProvinces = async () => {
		if (provincesCache.current) {
			setProvinces(provincesCache.current);
			return;
		}
		try {
			setLoading(true);
			const res = await fetch(`${BASE_URL}/p/`);
			const data: Province[] = await res.json();
			provincesCache.current = data;
			setProvinces(data);
		} catch (err) {
			console.error('Error fetching provinces:', err);
		} finally {
			setLoading(false);
		}
	};

	const fetchDistricts = async (
		provinceCode: number,
	): Promise<District[]> => {
		if (districtsCache.current[provinceCode]) {
			return districtsCache.current[provinceCode];
		}
		try {
			const res = await fetch(`${BASE_URL}/p/${provinceCode}?depth=2`);
			const data: ProvinceWithDistricts = await res.json();
			const list = data.districts ?? [];
			districtsCache.current[provinceCode] = list;
			return list;
		} catch (err) {
			console.error('Error fetching districts:', err);
			return [];
		}
	};

	const fetchWards = async (districtCode: number): Promise<Ward[]> => {
		if (wardsCache.current[districtCode]) {
			return wardsCache.current[districtCode];
		}
		try {
			const res = await fetch(`${BASE_URL}/d/${districtCode}?depth=2`);
			const data: DistrictWithWards = await res.json();
			const list = data.wards ?? [];
			wardsCache.current[districtCode] = list;
			return list;
		} catch (err) {
			console.error('Error fetching wards:', err);
			return [];
		}
	};

	useEffect(() => {
		fetchProvinces();
	}, []);

	// Initialize từ addressData
	useEffect(() => {
		const init = async () => {
			if (
				!addressData ||
				provinces.length === 0 ||
				initializationCompleteRef.current ||
				isInitializing
			)
				return;

			setIsInitializing(true);
			try {
				const {
					specificAddress: addr,
					ward,
					district,
					province,
				} = addressData;

				if (addr) setSpecificAddress(addr);

				if (province) {
					const foundProvince = provinces.find(
						(p) => p.name === province,
					);
					if (foundProvince) {
						setSelectedProvince(foundProvince.name);
						setSelectedProvinceCode(foundProvince.code);

						if (district) {
							const districtsList = await fetchDistricts(
								foundProvince.code,
							);
							setDistricts(districtsList);

							const foundDistrict = districtsList.find(
								(d) => d.name === district,
							);
							if (foundDistrict) {
								setSelectedDistrict(foundDistrict.name);
								setSelectedDistrictCode(foundDistrict.code);

								if (ward) {
									const wardsList = await fetchWards(
										foundDistrict.code,
									);
									setWards(wardsList);

									const foundWard = wardsList.find(
										(w) => w.name === ward,
									);
									if (foundWard)
										setSelectedWard(foundWard.name);
								}
							}
						}
					}
				}

				initializationCompleteRef.current = true;
			} catch (err) {
				console.error('Error initializing address:', err);
			} finally {
				setIsInitializing(false);
			}
		};

		init();
	}, [addressData, provinces, isInitializing]);

	const handleProvinceChange = async (value: string | number) => {
		const provinceName = String(value);
		setSelectedProvince(provinceName);
		setSelectedProvinceCode(null);
		setSelectedDistrict('');
		setSelectedDistrictCode(null);
		setSelectedWard('');
		setDistricts([]);
		setWards([]);

		const found = provinces.find((p) => p.name === provinceName);
		if (found) {
			setSelectedProvinceCode(found.code);
			setLoading(true);
			const list = await fetchDistricts(found.code);
			setDistricts(list);
			setLoading(false);
		}
	};

	const handleDistrictChange = async (value: string | number) => {
		const districtName = String(value);
		setSelectedDistrict(districtName);
		setSelectedDistrictCode(null);
		setSelectedWard('');
		setWards([]);

		const found = districts.find((d) => d.name === districtName);
		if (found) {
			setSelectedDistrictCode(found.code);
			setLoading(true);
			const list = await fetchWards(found.code);
			setWards(list);
			setLoading(false);
		}
	};

	const handleWardChange = (value: string | number) => {
		setSelectedWard(String(value));
	};

	const buildDisplayString = useCallback(() => {
		const parts: string[] = [];
		if (specificAddress.trim()) parts.push(specificAddress.trim());
		if (selectedWard) parts.push(selectedWard);
		if (selectedDistrict) parts.push(selectedDistrict);
		if (selectedProvince) parts.push(selectedProvince);
		return parts.join(', ');
	}, [specificAddress, selectedWard, selectedDistrict, selectedProvince]);

	// Emit changes to parent
	useEffect(() => {
		if (!initializationCompleteRef.current) return;

		const timeoutId = setTimeout(() => {
			const newData: AddressData = {
				specificAddress: specificAddress.trim(),
				ward: selectedWard || '',
				district: selectedDistrict || '',
				province: selectedProvince || '',
			};
			const dataString = JSON.stringify(newData);
			if (dataString !== lastEmittedDataRef.current) {
				lastEmittedDataRef.current = dataString;
				onChange?.(newData);
			}
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [
		specificAddress,
		selectedWard,
		selectedDistrict,
		selectedProvince,
		onChange,
	]);

	if (!isEditing) {
		const displayString = buildDisplayString();
		return (
			<div className="flex items-center gap-2 text-sm">
				<MdLocationOn className="w-4 h-4 text-emerald-600 flex-shrink-0" />
				<p className="text-gray-900 font-medium">
					{displayString || (
						<span className="text-gray-400 italic">
							Chưa cập nhật
						</span>
					)}
				</p>
			</div>
		);
	}

	const provinceItems = provinces.map((p) => ({
		id: String(p.code),
		label: p.name,
		value: p.name,
	}));

	const districtItems = districts.map((d) => ({
		id: String(d.code),
		label: d.name,
		value: d.name,
	}));

	const wardItems = wards.map((w) => ({
		id: String(w.code),
		label: w.name,
		value: w.name,
	}));

	return (
		<div className="space-y-4">
			{showLabel && (
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
						<MdLocationOn className="w-4 h-4 text-emerald-600" />
						<span>Địa chỉ chi tiết</span>
					</div>
					{(loading || isInitializing) && (
						<div className="flex items-center gap-2 text-xs text-gray-500">
							<div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
							<span>Đang tải...</span>
						</div>
					)}
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<Dropdown
					items={provinceItems}
					value={selectedProvince}
					onChange={handleProvinceChange}
					placeholder="Tỉnh/Thành phố"
					icon={<FiMapPin className="w-4 h-4" />}
					fullWidth
					searchable
					size="md"
				/>
				<Dropdown
					items={districtItems}
					value={selectedDistrict}
					onChange={handleDistrictChange}
					placeholder={
						selectedProvince
							? 'Quận/Huyện'
							: 'Chọn Tỉnh/Thành phố trước'
					}
					icon={<MdLocationOn className="w-4 h-4" />}
					fullWidth
					searchable
					size="md"
				/>
				<Dropdown
					items={wardItems}
					value={selectedWard}
					onChange={handleWardChange}
					placeholder={
						selectedDistrict ? 'Phường/Xã' : 'Chọn Quận/Huyện trước'
					}
					icon={<MdLocationOn className="w-4 h-4" />}
					fullWidth
					searchable
					size="md"
				/>
			</div>

			<div className="space-y-1.5">
				<label className="block text-xs font-semibold text-gray-700">
					Địa chỉ cụ thể (Số nhà, tên đường, ...)
				</label>
				<div className="relative">
					<input
						type="text"
						value={specificAddress}
						onChange={(e) => setSpecificAddress(e.target.value)}
						placeholder="Ví dụ: Số 123, Đường Lê Lợi"
						autoComplete="off"
						className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-emerald-500/30 focus:border-emerald-500 transition-all hover:border-emerald-300"
					/>
					<FiHome className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 pointer-events-none" />
				</div>
			</div>

			<AnimatePresence>
				{buildDisplayString() && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<div className="flex items-start gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl">
							<div className="flex-shrink-0 w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
								<FiCheck className="w-4 h-4 text-white" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-xs font-bold text-emerald-700 mb-0.5 uppercase tracking-wide">
									📍 Địa chỉ đầy đủ
								</p>
								<p className="text-sm font-semibold text-gray-900 leading-relaxed break-words">
									{buildDisplayString()}
								</p>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
