// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'community.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class CommunityAdapter extends TypeAdapter<Community> {
  @override
  final int typeId = 3;

  @override
  Community read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Community(
      id: fields[0] as int,
      name: fields[1] as String,
      officialName: fields[2] as String?,
      lifeCircleId: fields[3] as int,
      blockId: fields[4] as int,
      address: fields[5] as String?,
      latitude: fields[6] as double?,
      longitude: fields[7] as double?,
      completionYear: fields[8] as int?,
      landArea: fields[9] as double?,
      buildingArea: fields[10] as double?,
      plotRatio: fields[11] as double?,
      greeningRate: fields[12] as double?,
      buildingCount: fields[13] as int?,
      floorCount: fields[14] as int?,
      parkingTotal: fields[15] as int?,
      parkingRatio: fields[16] as double?,
      nearestMetro: fields[17] as String?,
      busLines: (fields[18] as List?)?.cast<String>(),
      unitTypes: fields[19] as String?,
      mainUnitType: fields[20] as String?,
      unitAreaRange: fields[21] as String?,
      decorationStatus: fields[22] as String?,
      listingPrice: fields[23] as double?,
      dealPrice: fields[24] as double?,
      priceTrend: fields[25] as String?,
      daysOnMarket: fields[26] as int?,
      bargainingSpace: fields[27] as double?,
      onSaleCount: fields[28] as int?,
      onRentCount: fields[29] as int?,
      rentLevel: fields[30] as String?,
      assignedSchool: fields[31] as String?,
      gardenLandscape: fields[32] as String?,
      noiseSources: fields[33] as String?,
      propertyMgmtLevel: fields[34] as String?,
      security: fields[35] as String?,
      pedestrianVehicleSeparation: fields[36] as bool?,
      elevatorBrand: fields[37] as String?,
      floodingRisk: fields[38] as bool?,
      rating: fields[39] as double?,
      hasLitigationHistory: fields[40] as bool?,
      hasNegativeNews: fields[41] as bool?,
    );
  }

  @override
  void write(BinaryWriter writer, Community obj) {
    writer
      ..writeByte(42)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.officialName)
      ..writeByte(3)
      ..write(obj.lifeCircleId)
      ..writeByte(4)
      ..write(obj.blockId)
      ..writeByte(5)
      ..write(obj.address)
      ..writeByte(6)
      ..write(obj.latitude)
      ..writeByte(7)
      ..write(obj.longitude)
      ..writeByte(8)
      ..write(obj.completionYear)
      ..writeByte(9)
      ..write(obj.landArea)
      ..writeByte(10)
      ..write(obj.buildingArea)
      ..writeByte(11)
      ..write(obj.plotRatio)
      ..writeByte(12)
      ..write(obj.greeningRate)
      ..writeByte(13)
      ..write(obj.buildingCount)
      ..writeByte(14)
      ..write(obj.floorCount)
      ..writeByte(15)
      ..write(obj.parkingTotal)
      ..writeByte(16)
      ..write(obj.parkingRatio)
      ..writeByte(17)
      ..write(obj.nearestMetro)
      ..writeByte(18)
      ..write(obj.busLines)
      ..writeByte(19)
      ..write(obj.unitTypes)
      ..writeByte(20)
      ..write(obj.mainUnitType)
      ..writeByte(21)
      ..write(obj.unitAreaRange)
      ..writeByte(22)
      ..write(obj.decorationStatus)
      ..writeByte(23)
      ..write(obj.listingPrice)
      ..writeByte(24)
      ..write(obj.dealPrice)
      ..writeByte(25)
      ..write(obj.priceTrend)
      ..writeByte(26)
      ..write(obj.daysOnMarket)
      ..writeByte(27)
      ..write(obj.bargainingSpace)
      ..writeByte(28)
      ..write(obj.onSaleCount)
      ..writeByte(29)
      ..write(obj.onRentCount)
      ..writeByte(30)
      ..write(obj.rentLevel)
      ..writeByte(31)
      ..write(obj.assignedSchool)
      ..writeByte(32)
      ..write(obj.gardenLandscape)
      ..writeByte(33)
      ..write(obj.noiseSources)
      ..writeByte(34)
      ..write(obj.propertyMgmtLevel)
      ..writeByte(35)
      ..write(obj.security)
      ..writeByte(36)
      ..write(obj.pedestrianVehicleSeparation)
      ..writeByte(37)
      ..write(obj.elevatorBrand)
      ..writeByte(38)
      ..write(obj.floodingRisk)
      ..writeByte(39)
      ..write(obj.rating)
      ..writeByte(40)
      ..write(obj.hasLitigationHistory)
      ..writeByte(41)
      ..write(obj.hasNegativeNews);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CommunityAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
