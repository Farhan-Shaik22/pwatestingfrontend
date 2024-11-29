"use client"

import { useState } from "react"
import { Phone, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function MobileDialpad() {
  const [phoneNumber, setPhoneNumber] = useState("")

  const dialpadButtons = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "*", "0", "#"
  ]

  const handleNumberClick = (value) => {
    if (phoneNumber.length < 15) {
      setPhoneNumber(prevNumber => prevNumber + value)
    }
  }

  const handleDelete = () => {
    setPhoneNumber(prevNumber => prevNumber.slice(0, -1))
  }

  const handleCall = () => {
    alert(`Calling ${phoneNumber}`)
    // Implement actual call functionality here
  }

  return (
    (<div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-xs bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="text-3xl font-bold text-center mb-4 h-8">
          {phoneNumber || "Enter a number"}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {dialpadButtons.map((button) => (
            <Button
              key={button}
              variant="outline"
              className="h-16 text-2xl font-semibold"
              onClick={() => handleNumberClick(button)}>
              {button}
            </Button>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            size="icon"
            className="h-16 w-16"
            onClick={handleDelete}>
            <X className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            className="h-16 w-16 bg-green-500 hover:bg-green-600"
            onClick={handleCall}>
            <Phone className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>)
  );
}

