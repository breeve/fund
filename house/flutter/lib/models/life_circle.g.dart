// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'life_circle.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class LifeCircleAdapter extends TypeAdapter<LifeCircle> {
  @override
  final int typeId = 2;

  @override
  LifeCircle read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return LifeCircle(
      id: fields[0] as int,
      name: fields[1] as String,
      blockId: fields[2] as int,
      description: fields[3] as String?,
      communityCount: fields[4] as int? ?? 0,
    );
  }

  @override
  void write(BinaryWriter writer, LifeCircle obj) {
    writer
      ..writeByte(5)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.blockId)
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
      other is LifeCircleAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
