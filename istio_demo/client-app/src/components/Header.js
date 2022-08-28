import React from 'react'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import {  useAuth0 } from '@auth0/auth0-react'
import { LinkContainer } from 'react-router-bootstrap'

const Header = () => {
  const { user, isAuthenticated, logout, loginWithRedirect } = useAuth0()

  return (
     
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>MyShop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <NavDropdown  title={user.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <a href="javascript:void(0)"  onClick={loginWithRedirect}>
                  <i className="fas fa-user"></i>LogIn
                </a>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
    </header>
  )
}

export default Header
