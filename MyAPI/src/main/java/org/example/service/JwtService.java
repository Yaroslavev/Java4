package org.example.service;


import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.util.Date;

@Service
public class JwtService {
    @Value("${jwt.expiration-time}")
    private Integer expirationTime;
    @Value("${jwt.key}")
    private String key;

    public String generateToken(String username) {
        try {
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(username)
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + expirationTime))
                    .build();

            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);

            JWSSigner signer = new MACSigner(key.getBytes());
            signedJWT.sign(signer);

            return signedJWT.serialize();
        }
        catch (JOSEException e) {
            throw new RuntimeException("Error generating JWT", e);
        }
    }

    public String validateToken(String token) throws JOSEException, ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(key.getBytes());

        if (signedJWT.verify(verifier)) {
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            if (claims.getExpirationTime().after(new Date())) {
                return claims.getSubject();
            }
            else {
                throw new RuntimeException("Token expired");
            }
        }
        else {
            throw new RuntimeException("Invalid JWT");
        }
    }
}
