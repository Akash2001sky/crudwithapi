/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import nock from 'nock';

import {
  render,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react-native';
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
jest.mock('axios');
axios.get = jest
  .fn()
  .mockImplementationOnce(() => {
    return null;
  })
  .mockImplementation(() => {
    return {
      data: [
        {
          _id: '1',
          email: 'sunny123@gmail.com',
          name: 'sunny',
        },
      ],
    };
  });
axios.post = jest
  .fn()
  .mockImplementationOnce(() => {
    return Promise.reject('failed the post');
  })
  .mockImplementation(() => {
    return {
      data: {
        _id: '1',
        email: 'sunny123@gmail.com',
        name: 'sunny',
      },
    };
  });
axios.delete = jest
  .fn()
  .mockImplementationOnce(() => {
    return Promise.reject('failed the delete');
  })
  .mockImplementation(() => {
    return {
      data: {
        _id: '1',
        email: 'sunny123@gmail.com',
        name: 'sunny',
      },
    };
  });
axios.put = jest
  .fn()
  .mockImplementationOnce(() => {
    return Promise.reject('failed the put');
  })
  .mockImplementation(() => {
    return {
      data: {
        _id: '1',
        email: 'sunny123@gmail.com',
        name: 'sunny',
      },
    };
  });

describe('render the app', () => {
  beforeEach(() => {
    render(<App />);
  });
  afterEach(() => {
    jest.clearAllMocks();
    nock.cleanAll();
  });

  it('renders correctly', () => {
    const {getByTestId} = render(<App />);
    const vector = getByTestId('vector');
    const openAdd = getByTestId('openAdd');
    expect(vector).toBeTruthy();
    expect(vector).toBeTruthy();
    fireEvent.press(openAdd);
  });

  it('post the data', async () => {
    const {getByTestId, getByText, queryByText} = render(<App />);
    const openAdd = getByTestId('openAdd');
    fireEvent.press(openAdd);
    expect(openAdd).toBeTruthy();
    const addnameinput = getByTestId('addnameinput');
    const Addbutton = getByTestId('AddButton');
    const addemailinput = getByTestId('addemailinput');
    fireEvent.changeText(addnameinput, 'akash');
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

    const mockData = {
      _id: '1',
      email: 'akash@example.com',
      name: 'akash',
    };

    fireEvent.press(Addbutton);

    await waitFor(() => expect(screen.queryByText('akash')).toBeDefined());
  });
  it('post the data error', async () => {
    const {getByTestId, getByText, queryByText} = render(<App />);
    const openAdd = getByTestId('openAdd');
    fireEvent.press(openAdd);
    expect(openAdd).toBeTruthy();
    const addnameinput = getByTestId('addnameinput');
    const Addbutton = getByTestId('AddButton');
    const addemailinput = getByTestId('addemailinput');
    fireEvent.changeText(addnameinput, 'akash');
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

    await waitFor(() => expect(screen.queryByText('akash')).toBeDefined());
    // axios.post.mockRejectedValueOnce({error: 'failed request'});

    fireEvent.press(Addbutton);
    // fireEvent.press(openAdd)
    // fireEvent.press(Addbutton)
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'https://e7c9-2405-201-c413-c817-bd6f-a39a-2b00-3081.ngrok-free.app/addtodo',
        {email: 'akash@example.com', name: 'akash'},
      );
    });
  });
  it('should render the todo list items', async () => {
    const mockResponse = {
      data: {
        todo: [
          {
            _id: '1',
            name: 'Do laundry',
            email: 'laundry@example.com',
          },
        ],
      },
    };
    axios.get.mockResolvedValue(mockResponse);
    const {getByTestId, queryByTestId, getByText} = render(<App />);
    await waitFor(() => {
      const todoItems = getByTestId('flatlistdata');
      expect(todoItems.children.length).toBe(mockResponse.data.todo.length);
    });

    const updatebutton = getByTestId('UpdateButton');
    const detetebutton = getByTestId('detetebutton');
    fireEvent.press(updatebutton);
    expect(updatebutton).toBeTruthy();
    const updatetextname = getByTestId('updatetextname');
    const updatetextemail = getByTestId('updatetextemail');
    const updatedatabutton = getByTestId('updatedatabutton');

    fireEvent.changeText(updatetextname, 'akash');
    fireEvent.changeText(updatetextemail, 'akashrebala@gmail.com');

    fireEvent.press(updatedatabutton);

    fireEvent.press(detetebutton);
    await waitFor(() => expect(screen.queryByText('akash')).toBeDefined());
  });
  it('should render the todo list items', async () => {
    const mockResponse = {
      data: {
        todo: [
          {
            _id: '1',
            name: 'Do laundry',
            email: 'laundry@example.com',
          },
        ],
      },
    };
    axios.get.mockResolvedValue(mockResponse);
    const {getByTestId, queryByTestId, getByText} = render(<App />);
    await waitFor(() => {
      const todoItems = getByTestId('flatlistdata');
      expect(todoItems.children.length).toBe(mockResponse.data.todo.length);
    });

    const updatebutton = getByTestId('UpdateButton');
    const detetebutton = getByTestId('detetebutton');
    fireEvent.press(updatebutton);
    expect(updatebutton).toBeTruthy();
    const updatetextname = getByTestId('updatetextname');
    const updatetextemail = getByTestId('updatetextemail');
    const updatedatabutton = getByTestId('updatedatabutton');

    fireEvent.changeText(updatetextname, 'akash');
    fireEvent.changeText(updatetextemail, 'akashrebala@gmail.com');

    fireEvent.press(updatedatabutton);

    fireEvent.press(detetebutton);
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        'https://e7c9-2405-201-c413-c817-bd6f-a39a-2b00-3081.ngrok-free.app/delettodo',
        {data: {_id: '1'}},
      );
    });
  });
});
