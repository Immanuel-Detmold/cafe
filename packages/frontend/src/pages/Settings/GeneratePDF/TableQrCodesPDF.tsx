import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    backgroundColor: '#FBF3E7',
  },
  header: {
    width: '100%',
    fontSize: 20,
    fontWeight: 700,
    color: '#3E2723',
    marginBottom: 12,
  },
  card: {
    width: '33.33%',
    padding: 10,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C89F76',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  qr: {
    width: 140,
    height: 140,
  },
})

const TableQrCodesPDF = ({
  qrImages,
}: {
  qrImages: { table: string; dataUrl: string }[]
}) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      <Text style={styles.header}>Tisch-QR-Codes</Text>
      {qrImages.map(({ table, dataUrl }) => (
        <View key={table} style={styles.card} wrap={false}>
          <View style={styles.box}>
            <Image style={styles.qr} src={dataUrl} />
          </View>
        </View>
      ))}
    </Page>
  </Document>
)

export default TableQrCodesPDF
