import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryListing from './CategoryListing'
import PaymentForm from './Electricity'
import CableForm from './CableForm'
import InternetForm from './InternetForm'
import BettingForm from './BettingForm'

export default function MobileBills() {
  const navigate = useNavigate()
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)

  return (
    <AnimatePresence mode="wait">
      {selectedCategoryId === 'cable' ? (
        <CableForm
          key="cable"
          onBack={() => setSelectedCategoryId(null)}
        />
      ) : selectedCategoryId === 'internet' ? (
        <InternetForm
          key="internet"
          onBack={() => setSelectedCategoryId(null)}
        />
      ) : selectedCategoryId === 'betting' ? (
        <BettingForm
          key="betting"
          onBack={() => setSelectedCategoryId(null)}
        />
      ) : selectedCategoryId ? (
        <PaymentForm
          key="payment"
          categoryId={selectedCategoryId}
          onBack={() => setSelectedCategoryId(null)}
        />
      ) : (
        <motion.div
          key="listing"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <CategoryListing onSelect={setSelectedCategoryId} onBack={() => navigate(-1)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
