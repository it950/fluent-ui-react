import * as React from 'react'

import { LogContext } from './KnobContexts'
import { LogFormatter } from '@fluentui/docs-components'

const defaultFormatter: LogFormatter = (name: string) =>
  `${new Date().toLocaleTimeString()}: ${name}`

const useLogKnob = <T = (...args: any[]) => any>(
  name: string,
  callback?: T,
  formatter: LogFormatter = defaultFormatter,
): T => {
  const { appendLog } = React.useContext(LogContext)

  const proxy = React.useCallback<any>(
    (...a) => {
      appendLog(formatter(name, ...a))
      return (callback as any)(...a)
    },
    [appendLog, callback, name, formatter],
  )

  return proxy as T
}

export default useLogKnob
