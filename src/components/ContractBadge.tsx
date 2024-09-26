import { Badge } from './ui/Badge';
import { getCollection } from 'astro:content';
import { colors } from '~/lib/colors';

const contracts = await getCollection('contracts');

function getColor(index: number) {
  const colorsArray = Object.values(colors);
  return colorsArray[index * 2];
}

export function ContractBadge({ contract }: { contract: (typeof contracts)[number] }) {
  const position = contracts.findIndex((c) => c.slug === contract.slug);

  return (
    <Badge size="sm" variant="solid" style={{ background: getColor(position) }}>
      {contract.data.icon} {contract.data.title}
    </Badge>
  );
}
