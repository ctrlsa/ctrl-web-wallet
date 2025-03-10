'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Loader2, QrCode, Share2 } from 'lucide-react'

import { toast } from 'sonner'
import QRCode from 'qrcode'
import { useWallet } from '@/contexts/WalletContext'
import { contactsApi } from '@/services/api'
import { Contact } from '@/types'
import { RedeemEscrow } from '@/components/RedeemEscrow'
import { tokenList } from '@/utils/tokens'
import { redeemEscrow } from '@/utils/solanaUtils'
import { Connection, PublicKey } from '@solana/web3.js'
import { Button } from '@/components/ui/button'
import { createMnemonic, generateWalletFromMnemonic, Wallet } from '@/utils/wallet'
import WalletGenerator from '@/components/WalletGenerator'
import Image from 'next/image'

const truncateAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}

export default function Home() {
  const { setWalletSolana } = useWallet()

  const connection = new Connection('https://api.devnet.solana.com')

  const [contacts, setContacts] = useState<Contact[]>([])
  const { walletSolana } = useWallet()
  const [isFetchingContacts, setIsFetchingContacts] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [showWalletInfo, setShowWalletInfo] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [selectedQrCode, setSelectedQrCode] = useState<any | null>(null)

  useEffect(() => {
    if (!walletSolana) {
      const mnemonic = createMnemonic()
      const newWallet = generateWalletFromMnemonic('501', mnemonic, 0)
      if (newWallet) {
        setWalletSolana(newWallet)
      }
    }
  }, [walletSolana, setWalletSolana])

  const handleRedeem = async (secret: string, sender: string, token: string) => {
    console.log(secret, sender, token)
    if (!walletSolana) {
      toast.success('Create a wallet to receive tokens')
      return
    }
    if (walletSolana) {
      const balance = await connection.getBalance(new PublicKey(walletSolana.publicKey))
      if (balance === 0) {
        toast.error('Insufficient balance. Please, top up')
        return
      }
    }
    try {
      setIsRedeeming(true)
      await redeemEscrow(
        connection,
        walletSolana,
        token === 'SOL' ? tokenList[0].mintAddress : tokenList[1].mintAddress,
        sender,
        secret,
        token === 'SOL'
      )
      toast.success('Received tokens successfully! Check your wallet.')
    } catch (error) {
      console.error(error)
      toast.error('Invalid link or network error')
    } finally {
      setIsRedeeming(false)
    }
  }

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text)
      toast.success('Copied')
    } catch (error) {
      console.error(error)
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleQrClick = async (publicKey: string) => {
    const qr = await generateQR(publicKey)
    setSelectedQrCode(qr)
    setIsQrModalOpen(true)
    return qr
  }

  const closeModal = () => {
    setIsQrModalOpen(false)
    setSelectedQrCode(null)
  }
  const generateQR = async (text: string) => {
    try {
      const qr = await QRCode.toDataURL(text)
      return qr
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center min-h-screen p-4" // Adjust the pb value as needed to account for the footer
    >
      {isRedeeming && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Receiving tokens...</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full">
        {walletSolana && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tokenList.map((token) => (
              <div
                key={token.symbol}
                className="border rounded-xl p-4 md:p-6 dark:text-white text-black cursor-pointer hover:bg-accent/5 transition-colors"
                onClick={() => copyToClipboard(walletSolana.publicKey)}
              >
                <div className="flex items-start md:items-center space-x-3">
                  <div className="flex-shrink-0 mt-1 md:mt-0">{token.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <h3 className="font-medium text-sm md:text-md">{token.symbol}</h3>
                      <span className="bg-secondary rounded-3xl text-xs px-2 py-0.5 whitespace-nowrap">
                        Solana
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 break-all">
                      {truncateAddress(walletSolana.publicKey)}
                    </p>
                  </div>
                  <div className="flex space-x-1 md:space-x-2 ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full hover:bg-accent p-2"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <Share2 className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full hover:bg-accent p-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleQrClick(walletSolana.publicKey)
                      }}
                    >
                      <QrCode className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full hover:bg-accent p-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(walletSolana.publicKey)
                      }}
                    >
                      <Copy className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isQrModalOpen && selectedQrCode && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div className="bg-background p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-center">
                <Image
                  src={selectedQrCode}
                  alt="QR Code"
                  width={300}
                  height={300}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        )}
        <div className="mt-8">{walletSolana && <RedeemEscrow />}</div>
      </div>
    </motion.div>
  )
}
