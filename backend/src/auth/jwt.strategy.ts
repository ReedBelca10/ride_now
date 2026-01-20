/**
 * Stratégie JWT pour Passport
 * Valide les tokens JWT et extrait les informations de l'utilisateur
 */

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    /**
     * Valide le payload du token JWT
     * @param payload - Contenu du token JWT
     * @returns Les données de l'utilisateur extraites du token
     */
    async validate(payload: any) {
        return {
            id: payload.sub,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            role: payload.role
        };
    }
}
