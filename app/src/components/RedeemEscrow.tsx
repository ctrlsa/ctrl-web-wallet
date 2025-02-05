import React, { useState } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { Connection, PublicKey } from '@solana/web3.js'
import { redeemEscrow } from '@/utils/solanaUtils'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { tokenList } from '@/utils/tokens'

export const RedeemEscrow = () => {
  const { walletSolana } = useWallet()
  const [inputUrl, setInputUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const connection = new Connection('https://api.devnet.solana.com')

  const handleRedeem = async () => {
    if (!walletSolana) {
      toast.error('Wallet not connected')
      return
    }

    setLoading(true)
    try {
      const urlObj = new URL(inputUrl)
      // check if wallet has enough balance to redeem
      const balance = await connection.getBalance(new PublicKey(walletSolana.publicKey))
      console.log('balance', balance)
      if (balance == 0) {
        toast.error('Insufficient balance. Please, top up')
        return
      }
      const [secret, sender, token] = urlObj.searchParams.get('startapp')?.split('__') || []
      const isSol = token === 'SOL'

      if (!secret || !sender || token === undefined) {
        throw new Error('Invalid receive link')
      }

      await redeemEscrow(
        connection,
        walletSolana,
        isSol ? tokenList[0].mintAddress : tokenList[1].mintAddress,
        sender,
        secret,
        isSol
      )

      toast.success(`Received ${isSol ? 'SOL' : 'USDC'} successfully!`)
    } catch (error) {
      console.error('Failed to receive:', error)
      toast.error('Invalid link or network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <Input
          type="text"
          placeholder="Enter link from friend"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <Button variant="default" onClick={handleRedeem} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            'Receive crypto'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
