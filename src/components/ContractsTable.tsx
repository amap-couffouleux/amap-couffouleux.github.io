import * as Table from './ui/Table';
import { Badge } from './ui/Badge';
import { getCollection } from 'astro:content';

const contracts = await getCollection('contracts');

const periodicity = {
  weekly: 'Toutes les semaines',
  bimonthly: 'Toutes les 2 semaines',
  monthly: 'Tous les mois',
  bimester: 'Tous les 2 mois',
  quarterly: 'Tous les 3 mois',
  yearly: 'A fois par an',
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
          <Table.Header>Périodicité</Table.Header>
          <Table.Header>Inscription ouverte ?</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {contracts.map((contract) => (
          <Table.Row key={contract.id}>
            <Table.Cell css={{ fontWeight: 'medium' }}>
              <Badge size="sm" variant="solid" style={{ background: contract.data.color }}>
                {contract.data.icon} {contract.data.title}
              </Badge>
            </Table.Cell>
            <Table.Cell>{periodicity[contract.data.periodicity]}</Table.Cell>
            <Table.Cell>{contract.data.isOpened ? <BadgeYes /> : <BadgeNo />}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
