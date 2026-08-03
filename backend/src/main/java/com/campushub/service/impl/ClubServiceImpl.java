package com.campushub.service.impl;

import com.campushub.dto.ClubDto;
import com.campushub.dto.ClubMemberDto;
import com.campushub.entity.Club;
import com.campushub.entity.ClubMember;
import com.campushub.entity.User;
import com.campushub.exception.ResourceNotFoundException;
import com.campushub.repository.ClubMemberRepository;
import com.campushub.repository.ClubRepository;
import com.campushub.repository.UserRepository;
import com.campushub.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClubServiceImpl implements ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private ClubMemberRepository clubMemberRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<ClubDto> getAllClubs() {
        return clubRepository.findAll()
                .stream()
                .map(this::convertToClubDto)
                .collect(Collectors.toList());
    }

    @Override
    public ClubDto getClubById(Long id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Club not found with id: " + id));

        return convertToClubDto(club);
    }

    @Override
    public ClubDto createClub(ClubDto clubDto) {
        User creator = userRepository.findById(clubDto.getCreatedById())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + clubDto.getCreatedById()));

        Club club = new Club();
        club.setName(clubDto.getName());
        club.setDescription(clubDto.getDescription());
        club.setCreatedBy(creator);

        Club savedClub = clubRepository.save(club);
        return convertToClubDto(savedClub);
    }

    @Override
    public ClubDto updateClub(Long id, ClubDto clubDto) {
        Club existingClub = clubRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Club not found with id: " + id));

        if (clubDto.getName() != null && !clubDto.getName().trim().isEmpty()) {
            existingClub.setName(clubDto.getName());
        }

        if (clubDto.getDescription() != null) {
            existingClub.setDescription(clubDto.getDescription());
        }

        if (clubDto.getCreatedById() != null) {
            User creator = userRepository.findById(clubDto.getCreatedById())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found with id: " + clubDto.getCreatedById()));
            existingClub.setCreatedBy(creator);
        }

        Club updatedClub = clubRepository.save(existingClub);
        return convertToClubDto(updatedClub);
    }

    @Override
    public void deleteClub(Long id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Club not found with id: " + id));

        List<ClubMember> members = clubMemberRepository.findByClub_Id(id);
        clubMemberRepository.deleteAll(members);
        clubRepository.delete(club);
    }

    @Override
    public ClubMemberDto joinClub(Long clubId, Long userId) {
        if (clubMemberRepository.existsByClub_IdAndUser_Id(clubId, userId)) {
            throw new RuntimeException("User is already a member of this club");
        }

        Club club = clubRepository.findById(clubId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Club not found with id: " + clubId));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + userId));

        ClubMember clubMember = new ClubMember();
        clubMember.setClub(club);
        clubMember.setUser(user);
        clubMember.setRoleInClub("MEMBER");
        clubMember.setJoinedAt(LocalDateTime.now());

        ClubMember savedMember = clubMemberRepository.save(clubMember);
        return convertToClubMemberDto(savedMember);
    }

    @Override
    public void leaveClub(Long clubId, Long userId) {
        ClubMember clubMember = clubMemberRepository
                .findByClub_IdAndUser_Id(clubId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User is not a member of this club"));

        clubMemberRepository.delete(clubMember);
    }

    @Override
    public List<ClubMemberDto> getClubMembers(Long clubId) {
        if (!clubRepository.existsById(clubId)) {
            throw new ResourceNotFoundException("Club not found with id: " + clubId);
        }

        return clubMemberRepository.findByClub_Id(clubId)
                .stream()
                .map(this::convertToClubMemberDto)
                .collect(Collectors.toList());
    }

    private ClubDto convertToClubDto(Club club) {
        Long createdById = null;
        if (club.getCreatedBy() != null) {
            createdById = club.getCreatedBy().getId();
        }

        return new ClubDto(
                club.getId(),
                club.getName(),
                club.getDescription(),
                createdById
        );
    }

    private ClubMemberDto convertToClubMemberDto(ClubMember clubMember) {
        return new ClubMemberDto(
                clubMember.getId(),
                clubMember.getClub().getId(),
                clubMember.getUser().getId(),
                clubMember.getRoleInClub(),
                clubMember.getJoinedAt()
        );
    }
}