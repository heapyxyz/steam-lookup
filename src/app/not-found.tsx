import Center from "@/components/center"
import FixedElement from "@/components/fixed-element"
import SearchForm from "@/components/search-form"

export default function NotFound() {
  return (
    <>
      <FixedElement
        position="top"
        className="max-md:p-4 py-4 max-w-lg w-full mx-auto"
      >
        <div className="bg-card p-2 rounded-xl">
          <SearchForm />
        </div>
      </FixedElement>

      <Center>
        <h2 className="text-2xl font-bold">404!</h2>
        <p className="text-sm text-muted-foreground text-center">
          This page does not exist.
        </p>
      </Center>
    </>
  )
}
