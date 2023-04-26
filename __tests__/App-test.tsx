/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import axios from 'axios';
import {FlatList} from 'react-native/Libraries/Lists/FlatList';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {Text} from 'react-native';
jest.mock('react-native-vector-icons/AntDesign', () => 'AntDesign');
jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'MaterialCommunityIcons',
);
//axios mocking..
axios.get = jest
  .fn()
  .mockImplementationOnce(() => {
    return null;
  })
  .mockImplementation(() => {
    return {
      data: [
        {
          __v: 0,
          _id: '6448f40e192e9feb230b23fe',
          createdAt: '2023-04-26T09:51:10.488Z',
          email: 'sunny123@gmail.com',
          name: 'sunny',
          updatedAt: '2023-04-26T09:51:10.488Z',
        },
      ],
    };
  });

axios.post = jest
  .fn()
  .mockImplementationOnce(() => {
    return null;
  })
  .mockImplementation(() => {
    return {
      data: {
        __v: 0,
        _id: '6448f40e192e9feb230b23fe',
        createdAt: '2023-04-26T09:51:10.488Z',
        email: 'sunny123@gmail.com',
        name: 'sunny',
        updatedAt: '2023-04-26T09:51:10.488Z',
      },
    };
  });

describe('render the app', () => {
  it('renders correctly', () => {
    const {getByTestId} = render(<App />);
    const vector = getByTestId('vector');
    const openAdd = getByTestId('openAdd');
    expect(vector).toBeTruthy();
    expect(vector).toBeTruthy();
    fireEvent.press(openAdd);
  });
  it('put the data', () => {
    const {getByTestId, getByText, queryByText} = render(<App />);
    const openAdd = getByTestId('openAdd');
    fireEvent.press(openAdd);
    expect(openAdd).toBeTruthy();
    const addnameinput = getByTestId('addnameinput');
    const Addbutton = getByTestId('AddButton');
    const addemailinput = getByTestId('addemailinput');
    fireEvent.changeText(addnameinput);
    fireEvent.changeText(addemailinput, '');
    fireEvent(addemailinput, 'blur');
    expect(getByText('Email is required')).toBeTruthy();
    fireEvent.changeText(addemailinput, 'invalid');
    fireEvent(addemailinput, 'blur');
    expect(getByText('Invalid email format')).toBeTruthy();
    fireEvent.changeText(addemailinput, 'akash@example.com');
    expect(addemailinput.props.value).toBe('akash@example.com');
    fireEvent(addemailinput, 'blur');
    expect(queryByText('Invalid email format')).toBeFalsy();
    fireEvent.press(Addbutton);
    expect(Addbutton).toBeDefined();

    expect(Addbutton).toBeTruthy();
    const flatlistdata = getByTestId('flatlistdata');
    console.log(flatlistdata.props.renderItem);
  });
  it('Flatlist', () => {
    const itemData = {
      __v: 0,
      _id: '6448f40e192e9feb230b23fe',
      createdAt: '2023-04-26T09:51:10.488Z',
      email: 'sunny123@gmail.com',
      name: 'sunny',
      updatedAt: '2023-04-26T09:51:10.488Z',
    }
    const {getByTestId} =render(<App/>);
    const flat = getByTestId('flatlistdata');
    expect(flat).toBeDefined();
    const element = flat.props.renderItem(itemData);
console.log(element.props);

    
    expect(element.props.data).toEqual(itemData);
    expect(element.type).toBe(Device);

    // const UpdateButton=getByTestId('UpdateButton')
    // fireEvent.press(UpdateButton);
    // expect(UpdateButton).toBeTruthy()
  });
});
