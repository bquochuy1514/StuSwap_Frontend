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
	province_id: string;
	province_name: string;
	province_type: string;
}

interface District {
	district_id: string;
	district_name: string;
	district_type: string;
	province_id: string;
}

interface Ward {
	ward_id: string;
	ward_name: string;
	ward_type: string;
	district_id: string;
}

interface ApiResponse<T> {
	results: T[];
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
	const [selectedDistrict, setSelectedDistrict] = useState('');
	const [selectedWard, setSelectedWard] = useState('');
	const [specificAddress, setSpecificAddress] = useState('');

	const [loading, setLoading] = useState(false);
	const [isInitializing, setIsInitializing] = useState(false);

	const lastEmittedDataRef = useRef<string | null>(null);
	const initializationCompleteRef = useRef(false);

	// Cache để tránh fetch lại
	const provincesCache = useRef<Province[] | null>(null);
	const districtsCache = useRef<Record<string, District[]>>({});
	const wardsCache = useRef<Record<string, Ward[]>>({});

	// Fetch provinces on mount
	useEffect(() => {
		fetchProvinces();
	}, []);

	const fetchProvinces = async () => {
		if (provincesCache.current) {
			setProvinces(provincesCache.current);
			return;
		}

		try {
			setLoading(true);
			const response = await fetch(
				'https://api.vnappmob.com/api/v2/province/'
			);
			const data: ApiResponse<Province> = await response.json();
			provincesCache.current = data.results;
			setProvinces(data.results);
		} catch (error) {
			console.error('❌ Error fetching provinces:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchDistricts = async (provinceId: string) => {
		if (districtsCache.current[provinceId]) {
			return districtsCache.current[provinceId];
		}

		try {
			const response = await fetch(
				`https://api.vnappmob.com/api/v2/province/district/${provinceId}`
			);
			const data: ApiResponse<District> = await response.json();
			const districtsList: District[] = data.results || [];
			districtsCache.current[provinceId] = districtsList;
			return districtsList;
		} catch (error) {
			console.error('❌ Error fetching districts:', error);
			return [];
		}
	};

	const fetchWards = async (districtId: string) => {
		if (wardsCache.current[districtId]) {
			return wardsCache.current[districtId];
		}

		try {
			const response = await fetch(
				`https://api.vnappmob.com/api/v2/province/ward/${districtId}`
			);
			const data: ApiResponse<Ward> = await response.json();
			const wardsList: Ward[] = data.results || [];
			wardsCache.current[districtId] = wardsList;
			return wardsList;
		} catch (error) {
			console.error('❌ Error fetching wards:', error);
			return [];
		}
	};

	// Initialize from addressData
	useEffect(() => {
		const initializeAddress = async () => {
			if (
				!addressData ||
				provinces.length === 0 ||
				initializationCompleteRef.current ||
				isInitializing
			) {
				return;
			}

			setIsInitializing(true);

			try {
				const {
					specificAddress: addr,
					ward,
					district,
					province,
				} = addressData;

				if (addr) {
					setSpecificAddress(addr);
				}

				if (province) {
					const foundProvince = provinces.find(
						(p) => p.province_name === province
					);

					if (foundProvince) {
						setSelectedProvince(foundProvince.province_name);

						if (district) {
							const districtsList = await fetchDistricts(
								foundProvince.province_id
							);
							setDistricts(districtsList);

							const foundDistrict = districtsList.find(
								(d) => d.district_name === district
							);

							if (foundDistrict) {
								setSelectedDistrict(
									foundDistrict.district_name
								);

								if (ward) {
									const wardsList = await fetchWards(
										foundDistrict.district_id
									);
									setWards(wardsList);

									const foundWard = wardsList.find(
										(w) => w.ward_name === ward
									);

									if (foundWard) {
										setSelectedWard(foundWard.ward_name);
									}
								}
							}
						}
					}
				}

				initializationCompleteRef.current = true;
			} catch (error) {
				console.error('❌ Error initializing address:', error);
			} finally {
				setIsInitializing(false);
			}
		};

		initializeAddress();
	}, [addressData, provinces, isInitializing]);

	// Handle province change
	const handleProvinceChange = async (value: string | number) => {
		const provinceName = String(value);
		setSelectedProvince(provinceName);
		setSelectedDistrict('');
		setSelectedWard('');
		setWards([]);

		if (provinceName) {
			const province = provinces.find(
				(p) => p.province_name === provinceName
			);
			if (province) {
				setLoading(true);
				const districtsList = await fetchDistricts(
					province.province_id
				);
				setDistricts(districtsList);
				setLoading(false);
			}
		} else {
			setDistricts([]);
		}
	};

	// Handle district change
	const handleDistrictChange = async (value: string | number) => {
		const districtName = String(value);
		setSelectedDistrict(districtName);
		setSelectedWard('');

		if (districtName) {
			const district = districts.find(
				(d) => d.district_name === districtName
			);
			if (district) {
				setLoading(true);
				const wardsList = await fetchWards(district.district_id);
				setWards(wardsList);
				setLoading(false);
			}
		} else {
			setWards([]);
		}
	};

	// Handle ward change
	const handleWardChange = (value: string | number) => {
		const wardName = String(value);
		setSelectedWard(wardName);
	};

	// Build display string
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
			const newAddressData: AddressData = {
				specificAddress: specificAddress.trim(),
				ward: selectedWard || '',
				district: selectedDistrict || '',
				province: selectedProvince || '',
			};

			const dataString = JSON.stringify(newAddressData);
			if (dataString !== lastEmittedDataRef.current) {
				lastEmittedDataRef.current = dataString;
				onChange?.(newAddressData);
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

	// Convert to Dropdown items format
	const provinceItems = provinces.map((p) => ({
		id: p.province_id,
		label: p.province_name,
		value: p.province_name, // Sử dụng name làm value để dễ so sánh
	}));

	const districtItems = districts.map((d) => ({
		id: d.district_id,
		label: d.district_name,
		value: d.district_name,
	}));

	const wardItems = wards.map((w) => ({
		id: w.ward_id,
		label: w.ward_name,
		value: w.ward_name,
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
						className="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all hover:border-emerald-300"
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
