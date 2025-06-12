export type IPCResponse<DataType> = {
  success: boolean
  data: DataType
}

export type TNote = {
  id: string
  title: string
  description: string
  createdAt: Date
}
