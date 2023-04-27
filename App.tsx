/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  TextInput,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import axios from 'axios';
interface Iprops {}
interface Istate {
  todoData: [];
  isModal: boolean;
  inputName: string;
  inputEmail: string;
  updateName: string;
  updateEmail: string;
  getId: string;
  addModal: boolean;
  emailError: string;
}
class App extends React.Component<{}, Istate> {
  state: Istate = {
    todoData: [],
    isModal: false,
    inputName: '',
    inputEmail: '',
    updateName: '',
    updateEmail: '',
    getId: '',
    addModal: false,
    emailError: '',
  };

  fetchdata = async () => {
    try {
      const response = await axios.get(
        'https://e7c9-2405-201-c413-c817-bd6f-a39a-2b00-3081.ngrok-free.app/gettodo',
      );
      this.setState({todoData: response.data.todo});
    } catch (err) {
      console.log(err);
    }
  };
  componentDidMount(): void {
    this.fetchdata();
  }
  deletedata = async (id: any) => {
    console.log(id);

    try {
      await axios.delete(
        `https://e7c9-2405-201-c413-c817-bd6f-a39a-2b00-3081.ngrok-free.app/delettodo`,
        {
          data: {_id: id},
        },
      );
      this.fetchdata();

      // Alert.alert('Data deleted sucessfully!');
    } catch (err) {
      console.log(err);
    }
  };

  postdata = async () => {
    try {
      await axios.post(
        'https://e7c9-2405-201-c413-c817-bd6f-a39a-2b00-3081.ngrok-free.app/addtodo',
        {name: this.state.inputName, email: this.state.inputEmail},
      );

      this.fetchdata();

      // Alert.alert('successfully posted !')
    } catch (err) {
      console.log(err);
    }
  };

  validateEmail = () => {
    const {inputEmail} = this.state;
    if (!inputEmail) {
      this.setState({emailError: 'Email is required'});
    } else if (!/\S+@\S+\.\S+/.test(inputEmail)) {
      this.setState({emailError: 'Invalid email format'});
    } else {
      this.setState({emailError: ''});
    }
  };

  render(): React.ReactNode {
    const {todoData} = this.state;
    // console.log(todoData, '===============');
    console.log(this.state.todoData);

    return (
      <View style={{backgroundColor: '#000000', flex: 1}} testID="vector">
        <Text
          style={{
            color: '#ffffff',
            fontSize: 30,
            fontWeight: '600',
            margin: 20,
          }}>
          To-Do.
        </Text>
        <TouchableOpacity
          testID="openAdd"
          style={{position: 'absolute', margin: 20, marginLeft: 340}}
          onPress={() => {
            this.setState({addModal: !this.state.addModal});
          }}>
          <AntDesign name="pluscircle" size={40} color="#ffffff" />
        </TouchableOpacity>
        <FlatList
          testID="flatlistdata"
          data={todoData}
          renderItem={({item, index}: any) => {
            return (
              <View
                testID="flatdata"
                style={{
                  backgroundColor: '#ffffff',
                  margin: 10,
                  height: 50,
                  borderRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#000000',
                      marginHorizontal: 20,
                    }}>
                    {item?.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#000000',
                      marginHorizontal: 20,
                    }}>
                    {item?.email}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    testID="UpdateButton"
                    onPress={() => {
                      this.setState({
                        isModal: !this.state.isModal,
                        updateName: item.name,
                        updateEmail: item.email,
                        getId: item._id,
                      });
                    }}>
                    <MaterialCommunityIcons
                      name="file-edit"
                      size={30}
                      color="#000000"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="detetebutton"
                    onPress={() => {
                      this.deletedata(item._id);
                    }}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={30}
                      color="#000000"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
        <Modal visible={this.state.addModal} transparent={true}>
          <View
            style={{
              backgroundColor: '#000000aa',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                height: 300,
                width: 370,
                alignItems: 'center',
                borderRadius: 30,
              }}>
              <TextInput
                testID="addnameinput"
                placeholderTextColor={'#ffffff'}
                placeholder="Name"
                style={{
                  backgroundColor: '#000000',
                  width: 300,
                  marginBottom: 20,
                  borderRadius: 10,
                  color: '#ffffff',
                }}
                onChangeText={txt => this.setState({inputName: txt})}
                value={this.state.inputName}
              />

              <TextInput
                testID="addemailinput"
                placeholderTextColor={'#ffffff'}
                placeholder="Email"
                style={{
                  backgroundColor: '#000000',
                  width: 300,
                  borderRadius: 10,
                  color: '#ffffff',
                }}
                onChangeText={txt => this.setState({inputEmail: txt})}
                value={this.state.inputEmail}
                onBlur={this.validateEmail}
              />
              {this.state.emailError ? (
                <Text style={{color: 'red'}}>{this.state.emailError}</Text>
              ) : null}
              <TouchableOpacity
                testID="AddButton"
                onPress={() => {
                  this.validateEmail();
                  this.setState({addModal: !this.state.addModal});
                  this.postdata();
                  //Alert.alert('Data added sucessfully!');
                }}
                style={{
                  backgroundColor: '#000000',
                  width: 100,
                  margin: 20,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: '#ffffff', fontSize: 25, fontWeight: '600'}}>
                  ADD
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={this.state.isModal} transparent={true}>
          <View
            style={{
              backgroundColor: '#000000aa',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#ffffff',
                height: 400,
                width: 350,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TextInput
                placeholderTextColor="#ffffff"
                placeholder="Name"
                style={{
                  backgroundColor: '#000000',
                  width: 300,
                  borderRadius: 10,

                  marginBottom: 10,
                  color: '#ffffff',
                }}
                value={this.state.updateName}
                onChangeText={txt => this.setState({updateName: txt})}
                testID="updatetextname"
              />
              <TextInput
                placeholderTextColor="#ffffff"
                placeholder="Email"
                style={{
                  backgroundColor: '#000000',
                  width: 300,
                  borderRadius: 10,
                  color: '#ffffff',
                }}
                value={this.state.updateEmail}
                onChangeText={txt => this.setState({updateEmail: txt})}
                testID="updatetextemail"
              />
              <TouchableOpacity
                testID="updatedatabutton"
                style={{
                  height: 40,
                  backgroundColor: '#000000',
                  width: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  margin: 10,
                }}
                onPress={async () => {
                  this.setState({isModal: !this.state.isModal});
                  try {
                    await axios.put(
                      'https://e7c9-2405-201-c413-c817-bd6f-a39a-2b00-3081.ngrok-free.app/edittodo',
                      {
                        _id: this.state.getId,
                        name: this.state.updateName,
                        email: this.state.updateEmail,
                      },
                    );
                    this.fetchdata();
                    console.log('Data updated sucessfully!');

                    //Alert.alert('Data updated sucessfully!');
                  } catch (err) {
                    console.log(err);
                  }
                }}>
                <Text
                  style={{color: '#ffffff', fontWeight: '600', fontSize: 20}}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default App;
