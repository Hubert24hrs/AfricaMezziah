import { useGetCartQuery } from '@store/api/cartApi'

export const useCart = () => {
  const { data: cart, isLoading, isError, refetch } = useGetCartQuery()
  return { cart, isLoading, isError, refetch, itemCount: cart?.itemCount ?? 0 }
}
