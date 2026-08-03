package com.campushub.service.impl;

import com.campushub.dto.AnnouncementDto;
import com.campushub.entity.Announcement;
import com.campushub.entity.Club;
import com.campushub.entity.User;
import com.campushub.exception.ResourceNotFoundException;
import com.campushub.repository.AnnouncementRepository;
import com.campushub.repository.ClubRepository;
import com.campushub.repository.UserRepository;
import com.campushub.service.AnnouncementService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<AnnouncementDto> getAllAnnouncements() {
        return announcementRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AnnouncementDto getAnnouncementById(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found with id: " + id));
        return convertToDto(announcement);
    }

    @Override
    public AnnouncementDto createAnnouncement(AnnouncementDto announcementDto) {
        Club club = clubRepository.findById(announcementDto.getClubId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Club not found with id: " + announcementDto.getClubId()));

        User user = userRepository.findById(announcementDto.getPostedById())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + announcementDto.getPostedById()));

        Announcement announcement = new Announcement();
        announcement.setClub(club);
        announcement.setTitle(announcementDto.getTitle());
        announcement.setContent(announcementDto.getContent());
        announcement.setPostedBy(user);
        announcement.setPostedAt(LocalDateTime.now());

        Announcement savedAnnouncement = announcementRepository.save(announcement);
        return convertToDto(savedAnnouncement);
    }

    @Override
    public AnnouncementDto updateAnnouncement(Long id, AnnouncementDto announcementDto) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found with id: " + id));

        if (announcementDto.getClubId() != null) {
            Club club = clubRepository.findById(announcementDto.getClubId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Club not found with id: " + announcementDto.getClubId()));
            announcement.setClub(club);
        }

        if (announcementDto.getPostedById() != null) {
            User user = userRepository.findById(announcementDto.getPostedById())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "User not found with id: " + announcementDto.getPostedById()));
            announcement.setPostedBy(user);
        }

        if (announcementDto.getTitle() != null) {
            announcement.setTitle(announcementDto.getTitle());
        }

        if (announcementDto.getContent() != null) {
            announcement.setContent(announcementDto.getContent());
        }

        Announcement updatedAnnouncement = announcementRepository.save(announcement);
        return convertToDto(updatedAnnouncement);
    }

    @Override
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Announcement not found with id: " + id);
        }
        announcementRepository.deleteById(id);
    }

    private AnnouncementDto convertToDto(Announcement announcement) {
        AnnouncementDto dto = new AnnouncementDto();
        dto.setId(announcement.getId());
        dto.setClubId(announcement.getClub().getId());
        dto.setTitle(announcement.getTitle());
        dto.setContent(announcement.getContent());

        if (announcement.getPostedBy() != null) {
            dto.setPostedById(announcement.getPostedBy().getId());
        }
        dto.setPostedAt(announcement.getPostedAt());

        return dto;
    }
}