export type Credential = {
  email: string
  password: string
}

export type TaskItemProps = {
  id: number
  title: string
}

export type Task = {
  id: number
  title: string
  created_at: string
  updated_at: string
}

// 何型の配列なのかは「かっこの前」に書く
export type Tasks = Task[]
