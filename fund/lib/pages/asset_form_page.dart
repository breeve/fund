import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../stores/asset_store.dart';
import '../models/asset.dart';
import '../widgets/app_layout.dart';
import '../theme/app_theme.dart';

class AssetFormPage extends ConsumerStatefulWidget {
  const AssetFormPage({super.key, this.assetId});

  final String? assetId;

  @override
  ConsumerState<AssetFormPage> createState() => _AssetFormPageState();
}

class _AssetFormPageState extends ConsumerState<AssetFormPage> {
  final _formKey = GlobalKey<FormState>();
  AssetCategory _category = AssetCategory.fund;
  String _name = '';
  String _subType = '';
  final List<String> _tags = [];
  String _notes = '';
  double _total = 0;
  double _profit = 0;
  String _source = '蚂蚁财富';

  bool get _isEditing => widget.assetId != null;

  @override
  void initState() {
    super.initState();
    if (_isEditing) {
      Future.microtask(() {
        final assets = ref.read(assetStoreProvider).assets;
        final asset = assets.firstWhere(
          (a) => a.id == widget.assetId,
          orElse: () => throw Exception('Asset not found'),
        );
        _loadAsset(asset);
      });
    }
  }

  void _loadAsset(BaseAsset asset) {
    setState(() {
      _category = asset.category;
      _name = asset.name;
      _subType = asset.subType;
      _tags.clear();
      _tags.addAll(asset.tags);
      _notes = asset.notes;

      if (asset is PublicFundAsset) {
        _total = asset.total;
        _profit = asset.profit;
        _source = asset.source;
      } else if (asset is PrivateFundAsset) {
        _total = asset.total;
        _profit = asset.profit;
        _source = asset.source;
      } else if (asset is StrategyAsset) {
        _total = asset.total;
        _profit = asset.profit;
        _source = asset.source;
      } else if (asset is FixedTermAsset) {
        _total = asset.investmentAmount;
        _source = asset.source;
      } else if (asset is LiquidAsset) {
        _total = asset.total;
        _source = asset.source;
      } else if (asset is DerivativeAsset) {
        _total = asset.total;
        _profit = asset.profit;
        _source = asset.source;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: _isEditing ? '编辑资产' : '添加资产',
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildCategorySelector(),
              const SizedBox(height: 24),
              _buildNameField(),
              const SizedBox(height: 16),
              _buildSubTypeField(),
              const SizedBox(height: 16),
              _buildValueFields(),
              const SizedBox(height: 16),
              _buildSourceField(),
              const SizedBox(height: 16),
              _buildTagsField(),
              const SizedBox(height: 16),
              _buildNotesField(),
              const SizedBox(height: 32),
              _buildSubmitButton(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategorySelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '资产类别',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: AssetCategory.values.map((cat) {
            final isSelected = cat == _category;
            return ChoiceChip(
              label: Text(cat.displayName),
              selected: isSelected,
              onSelected: _isEditing ? null : (_) {
                setState(() {
                  _category = cat;
                  _subType = '';
                });
              },
              selectedColor: AppTheme.primary.withValues(alpha: 0.2),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildNameField() {
    return TextFormField(
      initialValue: _name,
      decoration: const InputDecoration(
        labelText: '资产名称',
        hintText: '输入资产名称',
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return '请输入资产名称';
        }
        return null;
      },
      onSaved: (value) => _name = value ?? '',
    );
  }

  Widget _buildSubTypeField() {
    final subTypes = _getSubTypesForCategory(_category);

    return DropdownButtonFormField<String>(
      value: subTypes.contains(_subType) ? _subType : null,
      decoration: const InputDecoration(
        labelText: '子类型',
      ),
      items: subTypes.map((type) {
        return DropdownMenuItem(value: type, child: Text(type));
      }).toList(),
      onChanged: (value) {
        setState(() => _subType = value ?? '');
      },
      validator: (value) {
        if (value == null || value.isEmpty) {
          return '请选择子类型';
        }
        return null;
      },
    );
  }

  List<String> _getSubTypesForCategory(AssetCategory category) {
    switch (category) {
      case AssetCategory.fund:
        return ['A股', 'H股', 'AH', '中美', '全球'];
      case AssetCategory.privateFund:
        return ['债券策略-长债', '债券策略-短债', '多策略-激进', '多策略-保守', '股票策略'];
      case AssetCategory.strategy:
        return ['全球精选90', '全球精选100', '股票基金金选', '行业景气度策略', '百分百进攻'];
      case AssetCategory.fixed:
        return ['银行定期', '股票定期'];
      case AssetCategory.liquid:
        return ['余额宝', '活期存款'];
      case AssetCategory.derivative:
        return ['黄金'];
      case AssetCategory.protection:
        return ['住房公积金', '个人公积金'];
    }
  }

  Widget _buildValueFields() {
    final showProfit = _category == AssetCategory.fund ||
        _category == AssetCategory.privateFund ||
        _category == AssetCategory.strategy ||
        _category == AssetCategory.derivative;

    return Column(
      children: [
        TextFormField(
          initialValue: _total > 0 ? _total.toString() : '',
          decoration: InputDecoration(
            labelText: _category == AssetCategory.fixed ? '投资金额' : '总额度',
            suffixText: '元',
          ),
          keyboardType: TextInputType.number,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return '请输入金额';
            }
            if (double.tryParse(value) == null) {
              return '请输入有效数字';
            }
            return null;
          },
          onSaved: (value) => _total = double.tryParse(value ?? '') ?? 0,
        ),
        if (showProfit) ...[
          const SizedBox(height: 16),
          TextFormField(
            initialValue: _profit > 0 ? _profit.toString() : '',
            decoration: const InputDecoration(
              labelText: '持有收益',
              suffixText: '元',
            ),
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value != null && value.isNotEmpty) {
                if (double.tryParse(value) == null) {
                  return '请输入有效数字';
                }
              }
              return null;
            },
            onSaved: (value) => _profit = double.tryParse(value ?? '') ?? 0,
          ),
        ],
      ],
    );
  }

  Widget _buildSourceField() {
    return DropdownButtonFormField<String>(
      value: _source,
      decoration: const InputDecoration(
        labelText: '资产来源',
      ),
      items: const [
        DropdownMenuItem(value: '蚂蚁财富', child: Text('蚂蚁财富')),
        DropdownMenuItem(value: '银行', child: Text('银行')),
        DropdownMenuItem(value: '其他', child: Text('其他')),
      ],
      onChanged: (value) {
        setState(() => _source = value ?? '蚂蚁财富');
      },
    );
  }

  Widget _buildTagsField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '标签',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            ...['国内', '全球', '港股'].map((tag) {
              return FilterChip(
                label: Text(tag),
                selected: _tags.contains(tag),
                onSelected: (selected) {
                  setState(() {
                    if (selected) {
                      _tags.add(tag);
                    } else {
                      _tags.remove(tag);
                    }
                  });
                },
              );
            }),
            ...['低风险', '中低风险', '中风险', '中高风险', '高风险'].map((tag) {
              return FilterChip(
                label: Text(tag),
                selected: _tags.contains(tag),
                onSelected: (selected) {
                  setState(() {
                    if (selected) {
                      _tags.add(tag);
                    } else {
                      _tags.remove(tag);
                    }
                  });
                },
              );
            }),
          ],
        ),
      ],
    );
  }

  Widget _buildNotesField() {
    return TextFormField(
      initialValue: _notes,
      decoration: const InputDecoration(
        labelText: '备注',
        hintText: '输入备注信息',
      ),
      maxLines: 3,
      onSaved: (value) => _notes = value ?? '',
    );
  }

  Widget _buildSubmitButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _submit,
        child: Text(_isEditing ? '保存修改' : '添加资产'),
      ),
    );
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    final notifier = ref.read(assetStoreProvider.notifier);
    final id = _isEditing ? widget.assetId! : notifier.generateId();
    final now = DateTime.now().toIso8601String();

    BaseAsset asset;

    switch (_category) {
      case AssetCategory.fund:
        asset = PublicFundAsset(
          id: id,
          name: _name,
          subType: _subType,
          tags: List.from(_tags),
          notes: _notes,
          entryTime: now,
          createdAt: now,
          updatedAt: now,
          source: _source,
          total: _total,
          profit: _profit,
        );
        break;
      case AssetCategory.privateFund:
        asset = PrivateFundAsset(
          id: id,
          name: _name,
          subType: _subType,
          tags: List.from(_tags),
          notes: _notes,
          entryTime: now,
          createdAt: now,
          updatedAt: now,
          source: _source,
          total: _total,
          profit: _profit,
        );
        break;
      case AssetCategory.strategy:
        asset = StrategyAsset(
          id: id,
          name: _name,
          subType: _subType,
          tags: List.from(_tags),
          notes: _notes,
          entryTime: now,
          createdAt: now,
          updatedAt: now,
          source: _source,
          total: _total,
          profit: _profit,
        );
        break;
      case AssetCategory.fixed:
        asset = FixedTermAsset(
          id: id,
          name: _name,
          subType: _subType,
          tags: List.from(_tags),
          notes: _notes,
          entryTime: now,
          createdAt: now,
          updatedAt: now,
          source: _source,
          investmentAmount: _total,
          duration: 1,
          startDate: now.substring(0, 10),
          annualReturn: 0,
        );
        break;
      case AssetCategory.liquid:
        asset = LiquidAsset(
          id: id,
          name: _name,
          subType: _subType,
          tags: List.from(_tags),
          notes: _notes,
          entryTime: now,
          createdAt: now,
          updatedAt: now,
          source: _source,
          total: _total,
        );
        break;
      case AssetCategory.derivative:
        asset = DerivativeAsset(
          id: id,
          name: _name,
          subType: _subType,
          tags: List.from(_tags),
          notes: _notes,
          entryTime: now,
          createdAt: now,
          updatedAt: now,
          source: _source,
          total: _total,
          profit: _profit,
        );
        break;
      case AssetCategory.protection:
        asset = ProtectionAsset(
          id: id,
          name: _name,
          subType: _subType,
          tags: List.from(_tags),
          notes: _notes,
          entryTime: now,
          createdAt: now,
          updatedAt: now,
        );
        break;
    }

    if (_isEditing) {
      notifier.updateAsset(asset);
    } else {
      notifier.addAsset(asset);
    }

    context.go('/assets');
  }
}
