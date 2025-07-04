import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Welcome to the Interactive Gallery</h1>
      <p className="mt-4">Explore images, comments, and more!</p>
    </div>
  )
}