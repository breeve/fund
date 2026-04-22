// GENERATED CODE - DO NOT MODIFY BY HAND
// Manual Hive adapter for DataSourceConfig

part of 'datasource_config.dart';

class DataSourceConfigAdapter extends TypeAdapter<DataSourceConfig> {
  @override
  final int typeId = 100; // Avoid conflict with other adapters

  @override
  DataSourceConfig read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return DataSourceConfig(
      id: fields[0] as String,
      name: fields[1] as String,
      description: fields[2] as String,
      endpoints: Map<String, String>.from(fields[3] as Map),
      enabled: fields[4] as bool? ?? true,
    );
  }

  @override
  void write(BinaryWriter writer, DataSourceConfig obj) {
    writer
      ..writeByte(5)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.description)
      ..writeByte(3)
      ..write(obj.endpoints)
      ..writeByte(4)
      ..write(obj.enabled);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DataSourceConfigAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
