import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { Button, WingBlank, InputItem, Toast } from "@ant-design/react-native";
import { ImageBackground, StyleSheet } from "react-native";
import { getPhoneSendCode, appLogin } from "./service";
import bgImg from "../../images/loginbgimg.png";
import loginlogo from "../../images/loginlogo.png";
import loginPhone from "../../images/loginPhone.png";
import loginYzm from "../../images/loginYzm.png";
import loginYqm from "../../images/loginYqm.png";
import signButton from "../../images/sign.png";
import touristlogin from "../../images/touristlogin.png";
import noCheck from "../../images/no_check.png";
import alCheck from "../../images/al_check.png";
import loginButton from "../../images/login_button.png";
import "./index.less";

Toast.config({
  duration: 0,
});
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneError: false,
      phoneValue: "",
      codeError: false,
      codeValue: "",
      yqmValue: "",
      registered: true,
      tourists: false,
      yqmError: false,
      time: 60,
      btnDisable: false,
      btnContent: "获取验证码",
      passwordError: false,
      passwordValue: "",
      passwordLogin: false,
      accountValue: "",
      accountError: false,
    };
    this.loginSubmit = this.loginSubmit.bind(this);
    this.beforeTouristLoginSubmit = this.beforeTouristLoginSubmit.bind(this);
    this.beForeLoginSubmit = this.beForeLoginSubmit.bind(this);
    this.passwordSubmit = this.passwordSubmit.bind(this);
    this.yzmSubmit = this.yzmSubmit.bind(this);
  }

  componentDidMount() {}

  loginSubmit() {
    const {
      phoneValue,
      codeValue,
      yqmValue,
      tourists,
      registered,
      accountValue,
      passwordValue,
      passwordLogin,
    } = this.state;
    if (passwordLogin) {
      if (!accountValue) {
        this.setState({ accountError: true });
        return;
      }
      if (!passwordValue) {
        this.setState({ passwordError: true });
        return;
      }
      const key = Toast.loading("登录中...");
      appLogin({
        tel: accountValue,
        password: passwordValue,
      })
        .then((res) => {
          if (res.data.status === 200) {
            Taro.setStorage({
              key: "userIdentity",
              data: res.data.data.userIdentity,
            });
            Toast.remove(key);
            if (res.data.data.newUser === 1) {
              Taro.navigateTo({
                url: `/pages/login/components/genderPage/index?userId=${res.data.data.userId}`,
              });
            } else {
              Taro.setStorage({
                key: "userId",
                data: res.data.data.userId,
                success: () => {
                  Taro.switchTab({
                    url: "/pages/index/index",
                  });
                },
              });
            }
          } else {
            Toast.remove(key);
            Toast.fail({
              content: `${res.data.msg}`,
              duration: 2,
            });
          }
        })
        .catch((error) => {
          Toast.remove(key);
          Toast.fail({
            content: `遇到了错误${error}`,
            duration: 2,
          });
        });
    } else {
      if (!phoneValue) {
        this.setState({ phoneError: true });
        return;
      }
      if (!codeValue) {
        this.setState({ codeError: true });
        return;
      }
      if (!registered && !tourists) {
        Toast.fail({
          content: "请选择注册用户/游客用户进行登录！",
          duration: 2,
        });
        return;
      }
      if (tourists) {
        if (!yqmValue) {
          Toast.fail({
            content: "游客登录邀请码不能为空！",
            duration: 2,
          });
          this.setState({ yqmError: true });
          return;
        }
        const key = Toast.loading("登录中...");
        appLogin({
          tel: this.state.phoneValue.replace(/\s/g, ""),
          code: this.state.codeValue,
          invitationCode: this.state.yqmValue,
        })
          .then((res) => {
            if (res.data.status === 200) {
              Taro.setStorage({
                key: "userIdentity",
                data: res.data.data.userIdentity,
              });
              Toast.remove(key);
              if (res.data.data.newUser === 1) {
                Taro.navigateTo({
                  url: `/pages/login/components/genderPage/index?userId=${res.data.data.userId}&loginType=tourist`,
                });
              } else {
                Taro.setStorage({
                  key: "userId",
                  data: res.data.data.userId,
                  success: () => {
                    Taro.switchTab({
                      url: "/pages/index/index",
                    });
                  },
                });
              }
            } else {
              Toast.remove(key);
              Toast.fail({
                content: `${res.data.msg}`,
                duration: 2,
              });
            }
          })
          .catch((error) => {
            Toast.remove(key);
            Toast.fail({
              content: `遇到了错误${error}`,
              duration: 2,
            });
          });
      } else {
        const key = Toast.loading("登录中...");
        appLogin({
          tel: this.state.phoneValue.replace(/\s/g, ""),
          code: this.state.codeValue,
          invitationCode: this.state.yqmValue,
        })
          .then((res) => {
            console.log(res);
            if (res.data.status === 200) {
              Taro.setStorage({
                key: "userIdentity",
                data: res.data.data.userIdentity,
              });
              Toast.remove(key);
              Taro.setStorage({
                key: "token",
                data: res.data.data.accessToken,
              });
              if (res.data.data.newUser === 1) {
                Taro.navigateTo({
                  url: `/pages/login/components/genderPage/index?userId=${res.data.data.userId}`,
                });
              } else {
                Taro.setStorage({
                  key: "userId",
                  data: res.data.data.userId,
                  success: () => {
                    Taro.switchTab({
                      url: "/pages/index/index",
                    });
                  },
                });
              }
            } else {
              Toast.remove(key);
              Toast.fail({
                content: `${res.data.msg}`,
                duration: 2,
              });
            }
          })
          .catch((error) => {
            Toast.remove(key);
            Toast.fail({
              content: `遇到了错误${error}`,
              duration: 2,
            });
          });
      }
    }
  }

  beforeTouristLoginSubmit() {
    this.setState({ registered: false, tourists: true });
  }

  beForeLoginSubmit() {
    this.setState({ registered: true, tourists: false, yqmError: false });
  }

  passwordSubmit() {
    this.setState({ passwordLogin: true });
  }

  yzmSubmit() {
    this.setState({ passwordLogin: false });
  }

  render() {
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

    const passwordLoginJSX = (
      <View>
        <InputItem
          clear
          error={this.state.accountError}
          value={this.state.accountValue}
          onChange={(value) => {
            this.setState({
              accountError: false,
              accountValue: value,
            });
          }}
          placeholder="请输入账号"
          placeholderTextColor="#ffffff"
          style={styles.phoneInput}
        >
          <Image
            src={loginPhone}
            style={styles.phone}
            className="boxShadowInput"
          />
        </InputItem>
        <Text style={{ backgroundColor: "transparent", height: 20 }}></Text>
        <InputItem
          clear
          error={this.state.passwordError}
          value={this.state.passwordValue}
          onChange={(value) => {
            this.setState({
              passwordError: false,
              passwordValue: value,
            });
          }}
          placeholder="请输入密码"
          placeholderTextColor="#ffffff"
          style={styles.phoneInput}
          type="password"
        >
          <Image
            src={loginYzm}
            style={styles.phone}
            className="boxShadowInput"
          />
        </InputItem>
        <Text style={{ backgroundColor: "transparent", height: 65 }}></Text>
      </View>
    );

    const yzmLoginJSX = (
      <View>
        <InputItem
          clear
          error={this.state.phoneError}
          value={this.state.phoneValue}
          onChange={(value) => {
            this.setState({
              phoneError: false,
              phoneValue: value,
            });
          }}
          placeholder="请输入手机号"
          placeholderTextColor="#ffffff"
          type="phone"
          style={styles.phoneInput}
        >
          <Image
            src={loginPhone}
            style={styles.phone}
            className="boxShadowInput"
          />
        </InputItem>
        <Text style={{ backgroundColor: "transparent", height: 20 }}></Text>
        <InputItem
          clear
          error={this.state.codeError}
          value={this.state.codeValue}
          onChange={(value) => {
            this.setState({
              codeError: false,
              codeValue: value,
            });
          }}
          placeholder="请输入验证码"
          placeholderTextColor="#ffffff"
          style={styles.phoneInput}
          extra={
            <Button
              size="small"
              disabled={this.state.btnDisable}
              onPress={sendCode}
              style={styles.getYzm}
            >
              <Text style={styles.yzmColor}>{this.state.btnContent}</Text>
            </Button>
          }
        >
          <Image
            src={loginYzm}
            style={styles.phone}
            className="boxShadowInput"
          />
        </InputItem>

        <Text style={{ backgroundColor: "transparent", height: 20 }}></Text>
        {this.state.registered ? (
          <InputItem
            clear
            error={this.state.yqmError}
            value={this.state.yqmValue}
            onChange={(value) => {
              this.setState({
                yqmError: false,
                yqmValue: value,
              });
            }}
            placeholderTextColor="#ffffff"
            placeholder="请输入邀请码（选填）"
            style={styles.phoneInput}
            extra={
              <View
                className="touristView"
                onClick={this.beforeTouristLoginSubmit}
              >
                <Image src={noCheck} className="checkImg" />
                <Text className="checkRightText">游客</Text>
              </View>
            }
          >
            <Image
              src={loginYqm}
              style={styles.phone}
              className="boxShadowInput"
            />
          </InputItem>
        ) : (
          <InputItem
            clear
            error={this.state.yqmError}
            value={this.state.yqmValue}
            onChange={(value) => {
              this.setState({
                yqmError: false,
                yqmValue: value,
              });
            }}
            placeholderTextColor="#ffffff"
            placeholder="请输入邀请码（必填）"
            style={styles.phoneInput}
            extra={
              <View className="touristView" onClick={this.beForeLoginSubmit}>
                <Image src={alCheck} className="checkImg" />
                <Text className="checkRightText">游客</Text>
              </View>
            }
          >
            <Image
              src={loginYqm}
              style={styles.phone}
              className="boxShadowInput"
            />
          </InputItem>
        )}
      </View>
    );

    return (
      <View style={styles.container}>
        <ImageBackground source={bgImg} style={styles.image}>
          <Text style={styles.loginText}>登录</Text>
          <Image style={styles.loginLogo} src={loginlogo} />
          <WingBlank size="lg" style={{ width: "80%" }}>
            {this.state.passwordLogin ? passwordLoginJSX : yzmLoginJSX}
          </WingBlank>

          <View style={styles.bottomView}>
            <Image
              src={loginButton}
              onClick={this.loginSubmit}
              style={styles.signUserButton}
            />
            <Text
              className="touristsButton"
              onClick={
                !this.state.passwordLogin ? this.passwordSubmit : this.yzmSubmit
              }
            >
              {!this.state.passwordLogin ? "密码登录" : "验证码登录"}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginText: {
    color: "white",
    fontSize: 28,
  },
  image: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  loginLogo: {
    width: 130,
    height: 152,
  },
  phoneInput: {
    marginLeft: -30,
    color: "white",
  },
  phone: {
    width: 28,
    height: 28,
    padding: 0,
    margin: 0,
  },
  getYzm: {
    borderRadius: 20,
  },
  yzmColor: {
    color: "#FF939D",
  },
  signUserButton: {
    height: 60,
  },
  bottomView: {
    alignItems: "center",
  },
});
