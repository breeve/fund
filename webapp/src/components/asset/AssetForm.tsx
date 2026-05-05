import { Form } from '@/components/ui/Form';
import type { Asset, AssetCategory } from '@/types/asset';

interface AssetFormProps {
  asset?: Asset;
  initialValues?: { category: AssetCategory; name: string; amount: number };
  onSubmit: (data: { category: AssetCategory; name: string; amount: number }) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'liquid', label: '流动资产' },
  { value: 'fixed', label: '固定资产' },
  { value: 'financial', label: '金融投资' },
  { value: 'protection', label: '保障资产' },
  { value: 'liability', label: '负债' },
];

const fields = [
  { name: 'category', label: '资产类别', type: 'select' as const, required: true, options: CATEGORY_OPTIONS },
  { name: 'name', label: '名称', type: 'text' as const, required: true, placeholder: '请输入资产名称' },
  { name: 'amount', label: '金额（元）', type: 'number' as const, required: true, placeholder: '请输入金额' },
];

export function AssetForm({ asset, initialValues, onSubmit }: AssetFormProps) {
  const vals = asset
    ? { category: asset.category, name: asset.name, amount: asset.amount }
    : initialValues;
  return (
    <Form
      fields={fields}
      initialValues={vals as Record<string, string | number>}
      onSubmit={(values) => {
        onSubmit({
          category: values.category as AssetCategory,
          name: values.name as string,
          amount: values.amount as number,
        });
      }}
      submitLabel="保存资产"
    />
  );
}
