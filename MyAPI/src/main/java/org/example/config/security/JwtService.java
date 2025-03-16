package org.example.config.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.example.entities.UserEntity;
import org.example.repository.IUserRoleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import static java.lang.String.format;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final IUserRoleRepository userRoleRepository;
    @Value("${jwt.key}")
    private String SECRET_KEY;

    public String generateAccessToken(UserEntity user) {
        var roles = userRoleRepository.findByUser(user);
        Date expireDate = new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000);

        SecretKey key = getSecretKey();

        return Jwts.builder()
                .subject(format("%s,%s", user.getId(), user.getUsername()))
                .claim("roles", roles.stream()
                        .map((role) -> role.getRole().getName()).toArray(String[]::new))
                .issuedAt(new Date())
                .expiration(expireDate)
                .signWith(key)
                .compact();
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getUserId(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject().split(",")[0];
    }

    public String getUsername(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject().split(",")[1];
    }

    public Date getExpirationDate(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getExpiration();
    }

    public boolean validate(String token) {
        try {
            SecretKey key = getSecretKey();
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SignatureException ex) {
            System.err.println("Invalid JWT signature - " + ex.getMessage());
        } catch (MalformedJwtException ex) {
            System.err.println("Invalid JWT token - " + ex.getMessage());
        } catch (ExpiredJwtException ex) {
            System.err.println("Expired JWT token - " + ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            System.err.println("Unsupported JWT token - " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            System.err.println("JWT claims string is empty - " + ex.getMessage());
        }
        return false;
    }
}