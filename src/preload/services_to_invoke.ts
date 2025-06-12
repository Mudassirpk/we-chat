import { IpcRenderer } from 'electron'
import { services } from '../main/services'

export function get_services_to_invoke(
  ipcRenderer: IpcRenderer
): Record<string, (...params: unknown[]) => Promise<unknown>> {
  const services_to_invoke = {}

  for (const controller_name of Object.keys(services)) {
    for (const service_name of Object.keys(services[controller_name])) {
      const global_service_name = `${controller_name}_${service_name}`
      services_to_invoke[global_service_name] = (...params) => {
        if (params.length > 0) return ipcRenderer.invoke(global_service_name, ...params)
        return ipcRenderer.invoke(global_service_name)
      }
    }
  }

  return services_to_invoke
}
