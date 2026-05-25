import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryListing from './CategoryListing'
import PaymentForm from './PaymentForm'
import CableForm from './CableForm'
import InternetForm from './InternetForm'

export default function DesktopBills() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)

  return (
    <AnimatePresence mode="wait">
      {selectedCategoryId === 'cable' ? (
        <motion.div
          key="cable"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 32 }}
          transition={{ duration: 0.22 }}
        >
          <CableForm onBack={() => setSelectedCategoryId(null)} />
        </motion.div>
      ) : selectedCategoryId === 'internet' ? (
        <motion.div
          key="internet"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 32 }}
          transition={{ duration: 0.22 }}
        >
          <InternetForm onBack={() => setSelectedCategoryId(null)} />
        </motion.div>
      ) : selectedCategoryId ? (
        <motion.div
          key="payment"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 32 }}
          transition={{ duration: 0.22 }}
        >
          <PaymentForm
            categoryId={selectedCategoryId}
            onBack={() => setSelectedCategoryId(null)}
          />
        </motion.div>
      ) : (
        <motion.div
          key="listing"
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.22 }}
        >
          <CategoryListing onSelect={setSelectedCategoryId} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
