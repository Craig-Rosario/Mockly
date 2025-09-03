"use client"

import * as React from "react"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

type RegistrationFormProps = ComponentProps<"form"> & {
  onSwitch?: () => void
}

export function RegistrationForm({
  className,
  onSwitch,
  ...props
}: RegistrationFormProps) {
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const fd = new FormData(e.currentTarget)
    const password = String(fd.get("password") || "")
    const confirm = String(fd.get("confirmPassword") || "")

    if (password !== confirm) {
      setSubmitting(false)
      setError("Passwords do not match.")
      return
    }

    // TODO: call your registration API with fd
    // await register(fd)

    setSubmitting(false)
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={onSubmit}
      noValidate
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to register
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder=""
            autoComplete="name"
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="xyz@gmail.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={error ? "true" : "false"}
          />
          {error ? (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Registering..." : "Register"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        {onSwitch ? (
          <button
            type="button"
            onClick={onSwitch}
            className="underline underline-offset-4"
          >
            Login
          </button>
        ) : (
          <Link to="/login" className="underline underline-offset-4">
            Login
          </Link>

        )}
      </div>
    </form>
  )
}
