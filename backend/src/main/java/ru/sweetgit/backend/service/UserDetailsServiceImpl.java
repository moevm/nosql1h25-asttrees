package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.UserDetailsWithId;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    public static boolean isAdmin(UserDetails userDetails) {
        return userDetails.getAuthorities().contains(new SimpleGrantedAuthority(ROLE_ADMIN));
    }

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userService.getUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        var authorities = new ArrayList<GrantedAuthority>();
        if (user.isAdmin()) {
            authorities.add(new SimpleGrantedAuthority(ROLE_ADMIN));
        }

        return new UserDetailsWithId(
                user.id(),
                user.username(),
                user.passwordHash(),
                authorities
        );
    }
}
