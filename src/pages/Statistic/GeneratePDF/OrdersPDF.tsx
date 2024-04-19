import { OrdersAndItems } from '@/data/useOrders'
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

import cafeImage from './immanuelCafeBlack.png'

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf',
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    // backgroundColor: '#E4E4E4',
    padding: 35,
  },
  header: {
    fontSize: 35,
    marginBottom: 20,
    // textAlign: 'center',
    color: 'grey',

    // marginLeft: 20,
  },
  headerText: {
    fontSize: 35,
    fontFamily: 'Oswald',
    // marginLeft: 30,
  },
  date: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'Oswald',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '30%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: '70%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    marginLeft: 4,
    marginTop: 5,
    fontSize: 12,
    fontWeight: 500,
  },
  tableCell: {
    marginLeft: 4,
    marginTop: 5,
    fontSize: 10,
  },
  image: {
    width: 30,
    height: 30,
    // marginLeft: 4,
  },
})

const OrdersPDF = ({
  filteredData,
  selectedDate,
  sumTotalTurnover,
  sumTotalCash,
  sumTotalPayPal,
  sumTotalCafeCard,
}: {
  filteredData?: OrdersAndItems
  selectedDate?: string
  sumTotalTurnover?: string
  sumTotalCash?: string
  sumTotalPayPal?: string
  sumTotalCafeCard?: string
}) => {
  const totalOrderCount = filteredData ? filteredData.length : 0

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>
          <Image style={styles.image} src={cafeImage} />
          <Text style={styles.headerText}> Umsatzübersicht Immanuel Café</Text>
        </Text>
        <Text style={styles.date}>vom {selectedDate}</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Anzahl Bestellungen</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{totalOrderCount}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Gesamtumsatz</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{sumTotalTurnover}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Umsatz Bar</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{sumTotalCash}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Umsatz Café Karte</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{sumTotalCafeCard}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Umsatz PayPal</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{sumTotalPayPal}</Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            position: 'absolute',
            fontSize: 12,
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'grey',
          }}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  )
}

export default OrdersPDF
