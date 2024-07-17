import * as Table from './ui/Table';
import { Badge } from './ui/Badge';
import { getCollection } from 'astro:content';
import { colors } from '~/lib/colors';

const contracts = await getCollection('contracts');

const rythme = {
  weekly: 'hebdo',
  bimonthly: 'bimensuel',
  monthly: 'mensuel',
  bimester: 'bimestriel',
  quarterly: 'trimestriel',
  yearly: 'annuel',
} as const;

function BadgeYes() {
  return (
    <Badge css={{ colorPalette: 'green' }} variant={'solid'}>
      Oui
    </Badge>
  );
}
function BadgeNo() {
  return (
    <Badge css={{ colorPalette: 'red' }} variant={'solid'}>
      Non
    </Badge>
  );
}

export function ContractsTable({ className }: { className?: string }) {
  return (
    <Table.Root variant="plain" className={className}>
      <Table.Head>
        <Table.Row>
          <Table.Header>Produit(s)</Table.Header>
          <Table.Header>Rythme</Table.Header>
          <Table.Header>Inscription ouverte ?</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {contracts.map((contract) => (
          <Table.Row key={contract.id}>
            <Table.Cell css={{ fontWeight: 'medium' }}>
              <Badge size="sm" variant="solid" style={{ background: colors[contract.data.color] }}>
                {contract.data.icon} {contract.data.title}
              </Badge>
            </Table.Cell>
            <Table.Cell>{rythme[contract.data.rythme]}</Table.Cell>
            <Table.Cell>{contract.data.isOpened ? <BadgeYes /> : <BadgeNo />}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
