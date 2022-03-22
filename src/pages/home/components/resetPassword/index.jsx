import { Component } from "react";
import { View, Text, Image } from "@tarojs/components";
import {
  Button,
  WingBlank,
  WhiteSpace,
  Toast,
  TextareaItem,
  InputItem,
} from "@ant-design/react-native";
import { getPhoneSendCode, updatePassword } from "./service";
import styles from "./index.less";

class Resetpassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneError: false,
      phoneValue: "",
      yzmError: false,
      yzmValue: "",
      oneNewPassWordError: false,
      oneNewPassWordValue: "",
      twoNewPassWordError: false,
      twoNewPassWordValue: "",
      oldPassWordError: false,
      oldPassWordValue: "",
      time: 60,
      btnDisable: false,
      btnContent: "获取验证码",
      identity: "",
      username: "",
      loading: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      identity: this.props.route.params.identity,
      phoneValue: this.props.route.params.tel,
      username: this.props.route.params.username,
    });
  }

  onSubmit() {
    this.setState({ loading: true });
    const {
      identity,
      phoneValue,
      yzmValue,
      oneNewPassWordValue,
      twoNewPassWordValue,
      oldPassWordValue,
      username,
    } = this.state;

    if (identity == 1) {
      //特殊用户
      if (!oldPassWordValue) {
        this.setState({ oldPassWordError: true, loading: false });
        return;
      }
      if (!oneNewPassWordValue) {
        this.setState({ oneNewPassWordError: true, loading: false });
        return;
      }
      if (!twoNewPassWordValue) {
        this.setState({ twoNewPassWordError: true, loading: false });
        return;
      }
    } else {
      //普通用户
      if (!phoneValue) {
        this.setState({ phoneError: true, loading: false });
        return;
      }
      if (!yzmValue) {
        this.setState({ yzmError: true, loading: false });
        return;
      }
      if (!oneNewPassWordValue) {
        this.setState({ oneNewPassWordError: true, loading: false });
        return;
      }
      if (!twoNewPassWordValue) {
        this.setState({ twoNewPassWordError: true, loading: false });
        return;
      }
    }
    if (oneNewPassWordValue !== twoNewPassWordValue) {
      this.setState({
        twoNewPassWordError: true,
        oneNewPassWordError: true,
        loading: false,
      });
      Toast.fail({
        content: `俩次输入的密码不一致！`,
        duration: 2,
      });
      return;
    }
    updatePassword({
      code: yzmValue,
      identity,
      newPassword: oneNewPassWordValue,
      newPassword2: twoNewPassWordValue,
      password: oldPassWordValue,
      username: username,
    }).then((data) => {
      if (data.statusCode === 200) {
        Toast.success({
          content: "修改密码成功！",
          duration: 2,
        });
        this.setState({ loading: false });
      } else {
        Toast.fail({
          content: data.data.msg,
          duration: 2,
        });
        this.setState({ loading: false });
      }
    });
  }

  render() {
    console.log(
      "identityidentity",
      this.state.identity,
      "teltel",
      this.state.tel
    );
    let timeChange;
    let ti = this.state.time;
    //关键在于用ti取代time进行计算和判断，因为time在render里不断刷新，但在方法中不会进行刷新
    const clock = () => {
      if (ti > 0) {
        //当ti>0时执行更新方法
        ti = ti - 1;
        this.setState({
          time: ti,
          btnContent: `重新获取(${ti}s)`,
        });
      } else {
        //当ti=0时执行终止循环方法
        clearInterval(timeChange);
        this.setState({
          btnDisable: false,
          time: 60,
          btnContent: "获取验证码",
        });
      }
    };
    const sendCode = () => {
      if (!this.state.phoneValue.replace(/\s/g, "")) {
        this.setState({ phoneError: true });
        Toast.fail({
          content: "请输入手机号！",
          duration: 2,
        });
        return;
      }
      const key = Toast.loading("发送中...");
      getPhoneSendCode(this.state.phoneValue.replace(/\s/g, ""))
        .then((res) => {
          if (res.data.status === 200) {
            Toast.remove(key);
            Toast.success({
              duration: 1,
              content: "发送成功！",
            });
            this.setState({
              btnDisable: true,
              btnContent: "重新获取(60s)",
            });
            //每隔一秒执行一次clock方法
            timeChange = setInterval(clock, 1000);
          } else {
            Toast.remove(key);
            Toast.fail({
              content: `遇到了错误${res.data.msg}`,
              duration: 2,
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
          Toast.remove(key);
          Toast.fail({
            content: `遇到了错误${error}`,
            duration: 2,
          });
        });
    };

    const normalUserJSX = (
      <View>
        <InputItem
          clear
          disabled
          error={this.state.phoneError}
          value={this.state.phoneValue}
          onChange={(value) => {
            this.setState({
              phoneError: false,
              phoneValue: value,
            });
          }}
          placeholder="请输入手机号"
          extra={
            <Button
              size="small"
              disabled={this.state.btnDisable}
              onPress={sendCode}
            >
              <Text>{this.state.btnContent}</Text>
            </Button>
          }
          style={{ color: "black" }}
        >
          手机号
        </InputItem>
        <InputItem
          placeholder="请输入验证码"
          clear
          error={this.state.yzmError}
          value={this.state.yzmValue}
          onChange={(value) => {
            this.setState({
              yzmError: false,
              yzmValue: value,
            });
          }}
        >
          验证码
        </InputItem>
        <InputItem
          type="password"
          placeholder="请输入新密码"
          clear
          error={this.state.oneNewPassWordError}
          value={this.state.oneNewPassWordValue}
          onChange={(value) => {
            this.setState({
              oneNewPassWordError: false,
              oneNewPassWordValue: value,
            });
          }}
        >
          新密码
        </InputItem>
        <InputItem
          type="password"
          placeholder="请再次输入新密码"
          clear
          error={this.state.twoNewPassWordError}
          value={this.state.twoNewPassWordValue}
          onChange={(value) => {
            this.setState({
              twoNewPassWordError: false,
              twoNewPassWordValue: value,
            });
          }}
          onBlur={(value) => {
            if (this.state.oneNewPassWordValue !== value) {
              this.setState({
                twoNewPassWordError: false,
              });
              Toast.fail({
                content: `俩次输入的密码不一致！`,
                duration: 2,
              });
            }
          }}
          onVirtualKeyboardConfirm={(value) => {
            if (this.state.oneNewPassWordValue !== value) {
              this.setState({
                twoNewPassWordError: false,
              });
              Toast.fail({
                content: `俩次输入的密码不一致！`,
                duration: 2,
              });
            }
          }}
        >
          确认密码
        </InputItem>
      </View>
    );

    const notNormalUserJSX = (
      <View>
        <InputItem
          placeholder="请输入旧密码"
          type="password"
          clear
          error={this.state.oldPassWordError}
          value={this.state.oldPassWordValue}
          onChange={(value) => {
            this.setState({
              oldPassWordError: false,
              oldPassWordValue: value,
            });
          }}
        >
          旧密码
        </InputItem>

        <InputItem
          type="password"
          placeholder="请输入新密码"
          clear
          error={this.state.oneNewPassWordError}
          value={this.state.oneNewPassWordValue}
          onChange={(value) => {
            this.setState({
              oneNewPassWordError: false,
              oneNewPassWordValue: value,
            });
          }}
        >
          新密码
        </InputItem>
        <InputItem
          type="password"
          placeholder="请再次输入新密码"
          clear
          error={this.state.twoNewPassWordError}
          value={this.state.twoNewPassWordValue}
          onChange={(value) => {
            this.setState({
              twoNewPassWordError: false,
              twoNewPassWordValue: value,
            });
          }}
          onBlur={(value) => {
            if (this.state.oneNewPassWordValue !== value) {
              this.setState({
                twoNewPassWordError: false,
              });
              Toast.fail({
                content: `俩次输入的密码不一致！`,
                duration: 2,
              });
            }
          }}
          onVirtualKeyboardConfirm={(value) => {
            if (this.state.oneNewPassWordValue !== value) {
              this.setState({
                twoNewPassWordError: false,
              });
              Toast.fail({
                content: `俩次输入的密码不一致！`,
                duration: 2,
              });
            }
          }}
        >
          确认密码
        </InputItem>
      </View>
    );

    return (
      <View className={styles["styles"]}>
        <WhiteSpace size="xl" />
        <WingBlank>
          {this.state.identity == 1 ? notNormalUserJSX : normalUserJSX}

          <WhiteSpace size="xl" />
          <Button
            type="primary"
            onPress={this.onSubmit}
            loading={this.state.loading}
            disabled={this.state.loading}
          >
            提交
          </Button>
        </WingBlank>
      </View>
    );
  }
}

export default Resetpassword;
// 下面用来connect数据层
// export default connect(
//   ({
//     resetPassword,
//   }) => ({
//     resetPassword,
//   }),
// )(Resetpassword);
