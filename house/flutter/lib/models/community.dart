import 'package:hive/hive.dart';

part 'community.g.dart';

@HiveType(typeId: 3)
class Community extends HiveObject {
  @HiveField(0)
  final int id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String? officialName;

  @HiveField(3)
  final int lifeCircleId;

  @HiveField(4)
  final int blockId;

  // Basic info
  @HiveField(5)
  final String? address;

  @HiveField(6)
  final double? latitude;

  @HiveField(7)
  final double? longitude;

  @HiveField(8)
  final int? completionYear;

  // Building info
  @HiveField(9)
  final double? landArea;

  @HiveField(10)
  final double? buildingArea;

  @HiveField(11)
  final double? plotRatio;

  @HiveField(12)
  final double? greeningRate;

  @HiveField(13)
  final int? buildingCount;

  @HiveField(14)
  final int? floorCount;

  // Parking
  @HiveField(15)
  final int? parkingTotal;

  @HiveField(16)
  final double? parkingRatio;

  // Traffic
  @HiveField(17)
  final String? nearestMetro;

  @HiveField(18)
  final List<String>? busLines;

  // Units
  @HiveField(19)
  final String? unitTypes;

  @HiveField(20)
  final String? mainUnitType;

  @HiveField(21)
  final String? unitAreaRange;

  @HiveField(22)
  final String? decorationStatus;

  // Pricing
  @HiveField(23)
  final double? listingPrice;

  @HiveField(24)
  final double? dealPrice;

  @HiveField(25)
  final String? priceTrend;

  @HiveField(26)
  final int? daysOnMarket;

  @HiveField(27)
  final double? bargainingSpace;

  @HiveField(28)
  final int? onSaleCount;

  @HiveField(29)
  final int? onRentCount;

  @HiveField(30)
  final String? rentLevel;

  // Education
  @HiveField(31)
  final String? assignedSchool;

  // Environment
  @HiveField(32)
  final String? gardenLandscape;

  @HiveField(33)
  final String? noiseSources;

  @HiveField(34)
  final String? propertyMgmtLevel;

  @HiveField(35)
  final String? security;

  @HiveField(36)
  final bool? pedestrianVehicleSeparation;

  @HiveField(37)
  final String? elevatorBrand;

  @HiveField(38)
  final bool? floodingRisk;

  // Reputation
  @HiveField(39)
  final double? rating;

  @HiveField(40)
  final bool? hasLitigationHistory;

  @HiveField(41)
  final bool? hasNegativeNews;

  Community({
    required this.id,
    required this.name,
    this.officialName,
    required this.lifeCircleId,
    required this.blockId,
    this.address,
    this.latitude,
    this.longitude,
    this.completionYear,
    this.landArea,
    this.buildingArea,
    this.plotRatio,
    this.greeningRate,
    this.buildingCount,
    this.floorCount,
    this.parkingTotal,
    this.parkingRatio,
    this.nearestMetro,
    this.busLines,
    this.unitTypes,
    this.mainUnitType,
    this.unitAreaRange,
    this.decorationStatus,
    this.listingPrice,
    this.dealPrice,
    this.priceTrend,
    this.daysOnMarket,
    this.bargainingSpace,
    this.onSaleCount,
    this.onRentCount,
    this.rentLevel,
    this.assignedSchool,
    this.gardenLandscape,
    this.noiseSources,
    this.propertyMgmtLevel,
    this.security,
    this.pedestrianVehicleSeparation,
    this.elevatorBrand,
    this.floodingRisk,
    this.rating,
    this.hasLitigationHistory,
    this.hasNegativeNews,
  });

  factory Community.fromJson(Map<String, dynamic> json) {
    return Community(
      id: json['id'] as int,
      name: json['name'] as String,
      officialName: json['official_name'] as String?,
      lifeCircleId: json['life_circle_id'] as int,
      blockId: json['block_id'] as int,
      address: json['address'] as String?,
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      completionYear: json['completion_year'] as int?,
      landArea: (json['land_area'] as num?)?.toDouble(),
      buildingArea: (json['building_area'] as num?)?.toDouble(),
      plotRatio: (json['plot_ratio'] as num?)?.toDouble(),
      greeningRate: (json['greening_rate'] as num?)?.toDouble(),
      buildingCount: json['building_count'] as int?,
      floorCount: json['floor_count'] as int?,
      parkingTotal: json['parking_total'] as int?,
      parkingRatio: (json['parking_ratio'] as num?)?.toDouble(),
      nearestMetro: json['nearest_metro'] as String?,
      busLines: (json['bus_lines'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      unitTypes: json['unit_types'] as String?,
      mainUnitType: json['main_unit_type'] as String?,
      unitAreaRange: json['unit_area_range'] as String?,
      decorationStatus: json['decoration_status'] as String?,
      listingPrice: (json['listing_price'] as num?)?.toDouble(),
      dealPrice: (json['deal_price'] as num?)?.toDouble(),
      priceTrend: json['price_trend'] as String?,
      daysOnMarket: json['days_on_market'] as int?,
      bargainingSpace: (json['bargaining_space'] as num?)?.toDouble(),
      onSaleCount: json['on_sale_count'] as int?,
      onRentCount: json['on_rent_count'] as int?,
      rentLevel: json['rent_level'] as String?,
      assignedSchool: json['assigned_school'] as String?,
      gardenLandscape: json['garden_landscape'] as String?,
      noiseSources: json['noise_sources'] as String?,
      propertyMgmtLevel: json['property_mgmt_level'] as String?,
      security: json['security'] as String?,
      pedestrianVehicleSeparation:
          json['pedestrian_vehicle_separation'] as bool?,
      elevatorBrand: json['elevator_brand'] as String?,
      floodingRisk: json['flooding_risk'] as bool?,
      rating: (json['rating'] as num?)?.toDouble(),
      hasLitigationHistory: json['has_litigation_history'] as bool?,
      hasNegativeNews: json['has_negative_news'] as bool?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'official_name': officialName,
        'life_circle_id': lifeCircleId,
        'block_id': blockId,
        'address': address,
        'latitude': latitude,
        'longitude': longitude,
        'completion_year': completionYear,
        'land_area': landArea,
        'building_area': buildingArea,
        'plot_ratio': plotRatio,
        'greening_rate': greeningRate,
        'building_count': buildingCount,
        'floor_count': floorCount,
        'parking_total': parkingTotal,
        'parking_ratio': parkingRatio,
        'nearest_metro': nearestMetro,
        'bus_lines': busLines,
        'unit_types': unitTypes,
        'main_unit_type': mainUnitType,
        'unit_area_range': unitAreaRange,
        'decoration_status': decorationStatus,
        'listing_price': listingPrice,
        'deal_price': dealPrice,
        'price_trend': priceTrend,
        'days_on_market': daysOnMarket,
        'bargaining_space': bargainingSpace,
        'on_sale_count': onSaleCount,
        'on_rent_count': onRentCount,
        'rent_level': rentLevel,
        'assigned_school': assignedSchool,
        'garden_landscape': gardenLandscape,
        'noise_sources': noiseSources,
        'property_mgmt_level': propertyMgmtLevel,
        'security': security,
        'pedestrian_vehicle_separation': pedestrianVehicleSeparation,
        'elevator_brand': elevatorBrand,
        'flooding_risk': floodingRisk,
        'rating': rating,
        'has_litigation_history': hasLitigationHistory,
        'has_negative_news': hasNegativeNews,
      };
}
