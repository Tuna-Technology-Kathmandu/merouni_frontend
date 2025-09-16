import SingleSubject from './SingleSubject'

export default async function Page({ params }) {
  const unwrappedParams = await params
  const slug = unwrappedParams.slugs

  return <SingleSubject slug={slug} />
}
