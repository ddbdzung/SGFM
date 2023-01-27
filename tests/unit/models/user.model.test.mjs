/* eslint-disable */
import { faker } from '@faker-js/faker/locale/vi'

import { User } from '../../../src/models/index.mjs'

describe('User model', () => {
  describe('User validation', () => {
    let newUser
    beforeEach(() => {
      newUser = {
        fullname: faker.internet.userName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
      }
    })

    it('should correctly validate a valid user', async () => {
      await expect(new User(newUser).validate()).resolves.toBeUndefined()
    })

    it('should lowercase all characters in email when saving', async () => {
      const { email } = await new User(newUser)
      expect(email.split('').every(char => char.toLowerCase())).toBeTruthy()
    })

    it('should throw a validation error if email is invalid', async () => {
      newUser.email = 'invalidEmail'
      await expect(new User(newUser).validate()).rejects.toThrow()
    })

    it('should throw a validation error if role is unknown', async () => {
      newUser.role = 'unknown'
      await expect(new User(newUser).validate()).rejects.toThrow()
    })

    it('should throw a validation error if gender is unknown', async () => {
      newUser.gender = 'unknown'
      await expect(new User(newUser).validate()).rejects.toThrow()
    })

    it('should throw a validation error if status is unknown', async () => {
      newUser.status = 'unknown'
      await expect(new User(newUser).validate()).rejects.toThrow()
    })

  })
})
