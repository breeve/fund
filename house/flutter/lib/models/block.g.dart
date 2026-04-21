// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'block.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class BlockAdapter extends TypeAdapter<Block> {
  @override
  final int typeId = 1;

  @override
  Block read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Block(
      id: fields[0] as int,
      name: fields[1] as String,
      districtId: fields[2] as int,
      description: fields[3] as String?,
      communityCount: fields[4] as int? ?? 0,
    );
  }

  @override
  void write(BinaryWriter writer, Block obj) {
    writer
      ..writeByte(5)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.districtId)
      ..writeByte(3)
      ..write(obj.description)
      ..writeByte(4)
      ..write(obj.communityCount);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is BlockAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
