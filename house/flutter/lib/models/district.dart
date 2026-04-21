import 'package:hive/hive.dart';

part 'district.g.dart';

@HiveType(typeId: 0)
class District extends HiveObject {
  @HiveField(0)
  final int id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String? description;

  @HiveField(3)
  final int blockCount;

  District({
    required this.id,
    required this.name,
    this.description,
    this.blockCount = 0,
  });

  factory District.fromJson(Map<String, dynamic> json) {
    return District(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String?,
      blockCount: json['block_count'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'block_count': blockCount,
      };
}
