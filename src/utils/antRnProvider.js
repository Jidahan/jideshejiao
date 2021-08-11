// 因为redux的Provider和ant design的Provider冲突，从而封装一层达到效果
// 同时以后调用与Provider相关的组件，不用在页面内包裹<Provider></Provider>
import { Provider } from '@ant-design/react-native'

const rnProvider = (props) => {
  return <Provider>{props.children}</Provider>
}

export default rnProvider