import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Keyboard, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { updateProfileRequest } from '~/store/modules/user/actions';
import { signOut } from '~/store/modules/auth/actions';

import Background from '~/components/Background';

import {
  Container,
  Title,
  Form,
  FormInput,
  Separator,
  SubmitButton,
  LogoutButton,
} from './styles';

const animatedOpacity = new Animated.Value(1.0);
const animatedHeight = new Animated.Value(49);

export default function Profile({ navigation }) {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.user.profile);

  const emailRef = useRef();
  const oldPasswordRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSubmit() {
    dispatch(
      updateProfileRequest({
        name,
        email,
        oldPassword,
        password,
        confirmPassword,
      })
    );
  }

  function handleLogout() {
    dispatch(signOut());
  }

  // Workaround to the white block bug when tabbar is hidden by React Navigation v4
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(animatedOpacity, {
        toValue: 0.0,
        duration: 300,
      }).start();
      Animated.timing(animatedHeight, { toValue: 0, duration: 500 }).start();

      // navigation.setParams({ tabBarVisible: false });
    });
    Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(animatedOpacity, {
        toValue: 1.0,
        duration: 700,
      }).start();
      Animated.timing(animatedHeight, { toValue: 49, duration: 300 }).start();

      // navigation.setParams({ tabBarVisible: true });
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    setOldPassword('');
    setPassword('');
    setConfirmPassword('');
  }, [profile]);

  return (
    <Background>
      <Container>
        <Title>My profile</Title>

        <Form>
          <FormInput
            icon="person-outline"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Full name"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            value={name}
            onChangeText={setName}
          />

          <FormInput
            icon="mail-outline"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="E-mail"
            ref={emailRef}
            returnKeyType="next"
            onSubmitEditing={() => oldPasswordRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />

          <Separator />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Current password"
            ref={oldPasswordRef}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={oldPassword}
            onChangeText={setOldPassword}
          />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="New password"
            ref={passwordRef}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current.focus()}
            value={password}
            onChangeText={setPassword}
          />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Confirm new password"
            ref={confirmPasswordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <SubmitButton onPress={handleSubmit}>Update profile</SubmitButton>
          <LogoutButton onPress={handleLogout}>
            Sign out of GoBarber
          </LogoutButton>
        </Form>
      </Container>
    </Background>
  );
}

Profile.navigationOptions = ({ navigation }) => ({
  // tabBarVisible:
  //   navigation.state.params &&
  //   navigation.state.params.tabBarVisible !== undefined
  //     ? navigation.state.params.tabBarVisible
  //     : true,
  tabBarLabel: 'My profile',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="person" size={20} color={tintColor} />
  ),
  tabBarOptions: {
    keyboardHidesTabBar: false,
    activeTintColor: '#fff',
    inactiveTintColor: 'rgba(255, 255, 255, 0.6)',
    style: {
      backgroundColor: '#8d41a8',
      opacity: animatedOpacity,
      height: animatedHeight,
      flexGrow: 1,
    },
  },
});
