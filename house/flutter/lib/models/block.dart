import 'package:hive/hive.dart';

part 'block.g.dart';

@HiveType(typeId: 1)
class Block extends HiveObject {
  @HiveField(0)
  final int id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final int districtId;

  @HiveField(3)
  final String? description;

  @HiveField(4)
  final int communityCount;

  Block({
    required this.id,
    required this.name,
    required this.districtId,
    this.description,
    this.communityCount = 0,
  });

  factory Block.fromJson(Map<String, dynamic> json) {
    return Block(
      id: json['id'] as int,
      name: json['name'] as String,
      districtId: json['district_id'] as int,
      description: json['description'] as String?,
      communityCount: json['community_count'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'district_id': districtId,
        'description': description,
        'community_count': communityCount,
      };
}
