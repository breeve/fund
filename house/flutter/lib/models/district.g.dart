// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'district.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class DistrictAdapter extends TypeAdapter<District> {
  @override
  final int typeId = 0;

  @override
  District read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return District(
      id: fields[0] as int,
      name: fields[1] as String,
      description: fields[2] as String?,
      blockCount: fields[3] as int? ?? 0,
    );
  }

  @override
  void write(BinaryWriter writer, District obj) {
    writer
      ..writeByte(4)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.description)
      ..writeByte(3)
      ..write(obj.blockCount);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DistrictAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
