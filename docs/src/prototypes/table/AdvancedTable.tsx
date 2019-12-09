import * as React from 'react'
import { Table, Flex, Text, Icon } from '@fluentui/react'
import { gridNestedBehavior } from '@fluentui/accessibility'

type TableCellComparator<T> = (cell1: T, cell2: T) => number

interface TableColumn {
  key: string
  name: string
  title: string
  cellComparator?: TableCellComparator<any>
}

interface AdvancedTableProps {
  rows: {}[]
  columns: TableColumn[]
  label: string
}

export const stringCellComparator: TableCellComparator<string> = (cell1: string, cell2: string) => {
  if (cell1 && cell2 && typeof cell1 === 'string' && typeof cell2 === 'string') {
    return cell1.localeCompare(cell2)
  }
  return -1
}

const AdvancedTable = (props: AdvancedTableProps) => {
  const { rows, columns, label } = props

  const [sortColumn, setSortColumn] = React.useState('')
  const [sortDirection, setSortDirection] = React.useState(0)

  let sortedRows = rows

  if (sortColumn && sortDirection) {
    const sortColumnIndex = columns.findIndex(column => column.name === sortColumn)
    const comparator = columns[sortColumnIndex].cellComparator
    if (comparator) {
      sortedRows = rows.sort((r1: any, r2: any) => {
        const cell1 = r1.items[sortColumnIndex]
        const cell2 = r2.items[sortColumnIndex]
        return comparator(cell1.content, cell2.content) * sortDirection
      })
    }
  }

  const sortColumnHeader = (title, order, onOrderChange) => ({
    content: (
      <Flex gap="gap.small">
        <Text content={title} />
        {order !== 0 ? <Icon name={order === 1 ? 'arrow-up' : 'arrow-down'} /> : ''}
      </Flex>
    ),
    key: title,
    onClick: () => onOrderChange(order === 0 ? 1 : -order),
  })

  const header = {
    key: 'header',
    items: columns.map(c =>
      sortColumnHeader(c.title, c.name === sortColumn ? sortDirection : 0, newSortDirection => {
        setSortColumn(c.name)
        setSortDirection(newSortDirection)
      }),
    ),
  }

  return (
    <Table
      variables={{ cellContentOverflow: 'none' }}
      header={header}
      rows={sortedRows}
      aria-label={label}
      accessibility={gridNestedBehavior}
    />
  )
}

export default AdvancedTable
