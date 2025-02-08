'use client'

import { useWallet } from '@/contexts/WalletContext'
import { motion } from 'framer-motion'
import TokenBalances from '@/components/TokenBalances'
import { useEffect, useMemo } from 'react'
import { Contact } from '@/types'
import { contactsApi } from '@/services/api'
import { generateWalletFromMnemonic, createMnemonic } from '@/utils/wallet'

const SendPage = () => {
  const { walletSolana, setWalletSolana } = useWallet()

  // Auto-generate wallet if it doesn't exist
  useEffect(() => {
    if (!walletSolana) {
      const mnemonic = createMnemonic()
      const newWallet = generateWalletFromMnemonic('501', mnemonic, 0)
      if (newWallet) {
        setWalletSolana(newWallet)
      }
    }
  }, [walletSolana, setWalletSolana])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col justify-center p-4"
    >
      {walletSolana && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 w-full flex flex-col justify-center items-center flex-grow"
        >
          <TokenBalances contacts={[]} defaultToken="SOL" />
        </motion.div>
      )}
    </motion.div>
  )
}

export default SendPage
