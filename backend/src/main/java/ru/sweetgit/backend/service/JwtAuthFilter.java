package ru.sweetgit.backend.service;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.sweetgit.backend.dto.ApiException;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        applyAuth(request);
        filterChain.doFilter(request, response);
    }

    private void applyAuth(HttpServletRequest request) {
        try {
            String jwt = getJwtFromRequest(request);

            if (jwt == null) {
                return;
            }

            if (!StringUtils.hasText(jwt) || !jwtService.validateToken(jwt)) {
                throw ApiException.badRequest().message("Invalid jwt token").build();
            }

            var userId = jwtService.extractUserId(jwt);

            var user = userService.getUserById(userId)
                    .orElseThrow(() -> ApiException.notFound("user", "id", userId).build());

            var userDetails = userService.buildUserDetails(user);

            var authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Could not set user authentication in security context", e);
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
