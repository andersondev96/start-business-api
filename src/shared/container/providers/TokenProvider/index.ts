import { container } from 'tsyringe'
import { JwtTokenProvider } from './implementation/JwtTokenProvider'
import { ITokenProvider } from './models/ITokenProvider'

container.registerSingleton<ITokenProvider>('TokenProvider', JwtTokenProvider)
