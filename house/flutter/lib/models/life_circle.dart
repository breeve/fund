import 'package:hive/hive.dart';

part 'life_circle.g.dart';

@HiveType(typeId: 2)
class LifeCircle extends HiveObject {
  @HiveField(0)
  final int id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final int blockId;

  @HiveField(3)
  final String? description;

  @HiveField(4)
  final int communityCount;

  LifeCircle({
    required this.id,
    required this.name,
    required this.blockId,
    this.description,
    this.communityCount = 0,
  });

  factory LifeCircle.fromJson(Map<String, dynamic> json) {
    return LifeCircle(
      id: json['id'] as int,
      name: json['name'] as String,
      blockId: json['block_id'] as int,
      description: json['description'] as String?,
      communityCount: json['community_count'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'block_id': blockId,
        'description': description,
        'community_count': communityCount,
      };
}
