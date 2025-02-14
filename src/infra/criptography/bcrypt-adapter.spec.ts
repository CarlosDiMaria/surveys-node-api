import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hashed_value')
  },
  async compare (): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

describe('Bcrypt Adapter', () => {
  const salt = 12

  test(('Should call Bcrypt with correct value'), async () => {
    const sut = new BcryptAdapter(salt)
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test(('Should return a hash if success'), async () => {
    const sut = new BcryptAdapter(salt)
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hashed_value')
  })

  test(('Should throw if Bcrypt throws'), async () => {
    const sut = new BcryptAdapter(salt)
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test(('Should call compare with correct value'), async () => {
    const sut = new BcryptAdapter(salt)
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_password', 'any_hashed_password')
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_hashed_password')
  })

  test(('Should return true if compare success'), async () => {
    const sut = new BcryptAdapter(salt)
    const isValid = await sut.compare('any_password', 'any_hashed_password')
    expect(isValid).toBeTruthy()
  })

  test(('Should return false when compare fails'), async () => {
    const sut = new BcryptAdapter(salt)
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => { Promise.resolve(false) })
    const isValid = await sut.compare('any_password', 'any_hashed_password')
    expect(isValid).toBeFalsy()
  })
})
