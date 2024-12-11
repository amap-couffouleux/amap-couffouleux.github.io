import * as Table from './ui/Table';
import { Badge } from './ui/Badge';
import { getCollection } from 'astro:content';
import { ContractBadge } from './ContractBadge';
import { Box } from 'styled-system/jsx';

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
    <Table.Root variant="plain" className={className} size={{ base: 'sm', smDown: 'md' }}>
      <Table.Head>
        <Table.Row>
          <Table.Header>Produit(s)</Table.Header>
          <Table.Header css={{ display: { smDown: 'none' } }}>Origine</Table.Header>
          <Table.Header>Rythme</Table.Header>
          <Table.Header>
            Inscription
            <br />
            ouverte ?
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {contracts.map((contract) => (
          <Table.Row key={contract.id}>
            <Table.Cell>
              <ContractBadge contract={contract} />
              <Box css={{ display: { sm: 'none' }, fontSize: 'xs', lineHeight: '1', mt: 1.5 }}>
                &nbsp;{contract.data.from}
              </Box>
            </Table.Cell>
            <Table.Cell css={{ display: { smDown: 'none' } }}> {contract.data.from}</Table.Cell>
            <Table.Cell>{rythme[contract.data.rythme]}</Table.Cell>
            <Table.Cell>{contract.data.isOpened ? <BadgeYes /> : <BadgeNo />}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
