import React from 'react'
import { Menu, Button } from 'semantic-ui-react'

const SignedOutMenu = ({signIn, register, drive}) => {
  return (
    <Menu.Item position="right">
    <Button onClick={signIn} basic content="Login" />
    <Button
      onClick={register}
      basic
      content="Get A Driver"
      style={{ marginLeft: '0.5em' }}
    />
    <Button
      onClick={drive}
      color="black"
      content="Become A Driver"
      style={{ marginLeft: '0.5em' }}
    />
  </Menu.Item>
  )
}

export default SignedOutMenu
